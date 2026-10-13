#!/usr/bin/env python3
"""Materialise this repo's source tree from the micro-repos that own it.

Commit d866aab emptied services/, shared/ and frontend/ -- their content was
migrated out to sibling repos -- but the build system stayed here: the root
CMakeLists.txt globs services/<domain>/*.cpp, docker/businessplanner-api.Dockerfile
does `COPY . .`, and docker-compose.yml builds images from ./services/...
paths. So the tree has to be reassembled before anything can build.

A target with a "ref" is extracted from that git ref of the repo (via
`git archive`) instead of copied from its working tree -- used for domains
that have no micro-repo home yet and still live only in this repo's history.

workspace.json holds the whole mapping; this file is just the mechanics.
"""
import argparse
import json
import os
import shutil
import io
import subprocess
import sys
import tarfile
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))


def load_config(path):
    with open(path) as handle:
        return json.load(handle)


def source_of(cfg, repos_root, spec):
    parts = [repos_root, spec["repo"]]
    if spec["path"]:
        parts.append(spec["path"])
    return os.path.normpath(os.path.join(*parts))


def extract_ref(repos_root, spec, dst):
    """Materialise spec["path"] at git ref spec["ref"] into dst."""
    repo = os.path.join(repos_root, spec["repo"])
    done = subprocess.run(["git", "-C", repo, "archive", "--format=tar",
                           spec["ref"], "--", spec["path"]],
                          capture_output=True)
    if done.returncode != 0:
        return False
    with tempfile.TemporaryDirectory() as tmp:
        with tarfile.open(fileobj=io.BytesIO(done.stdout)) as tar:
            tar.extractall(tmp, filter="data")
        src = os.path.join(tmp, spec["path"])
        if os.path.isdir(src):
            shutil.copytree(src, dst, dirs_exist_ok=True, symlinks=True)
        else:
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            shutil.copy2(src, dst)
    return True


def pull_repos(cfg, repos_root, verbose):
    """git pull each micro-repo, so a deploy picks up their latest code."""
    repos = sorted({spec["repo"] for spec in cfg["targets"].values()
                    if "ref" not in spec})
    failed = []
    for repo in repos:
        path = os.path.join(repos_root, repo)
        if not os.path.isdir(os.path.join(path, ".git")):
            failed.append((repo, "not a git checkout"))
            continue
        done = subprocess.run(["git", "-C", path, "pull", "--ff-only", "--quiet"],
                              capture_output=True, text=True)
        if done.returncode != 0:
            failed.append((repo, done.stderr.strip().splitlines()[-1:] or ["failed"]))
        elif verbose:
            print("  pulled %s" % repo)
    print("pulled %d/%d repos" % (len(repos) - len(failed), len(repos)))
    return failed


def assemble(cfg, repos_root, dry_run, verbose):
    ignore = shutil.ignore_patterns(*cfg.get("ignore", []))
    missing, copied = [], 0
    for dest, spec in cfg["targets"].items():
        dst = os.path.join(HERE, dest)
        if "ref" in spec:
            label = "%s@%s:%s" % (spec["repo"], spec["ref"], spec["path"])
            if verbose or dry_run:
                print("  %-34s <- %s" % (dest, label))
            if not dry_run and not extract_ref(repos_root, spec, dst):
                missing.append((dest, label))
                continue
            copied += 1
            continue
        src = source_of(cfg, repos_root, spec)
        if not os.path.isdir(src):
            missing.append((dest, src))
            continue
        if verbose or dry_run:
            print("  %-34s <- %s" % (dest, os.path.relpath(src, repos_root)))
        if not dry_run:
            shutil.copytree(src, dst, dirs_exist_ok=True, ignore=ignore,
                            symlinks=True)
        copied += 1
    return copied, missing


def rename_tree(cfg, verbose):
    """Apply cfg["rename"] ([from, to] pairs) to every assembled text file.

    The micro-repos carry Nextra's identifiers (nextra_db, nextra-api,
    NEXTRA_*, ...). This product ships under its own names, so they are
    rewritten here instead of being forked in every repo.
    """
    pairs = cfg.get("rename") or []
    if not pairs:
        return 0
    changed = 0
    for dest in cfg["targets"]:
        root = os.path.join(HERE, dest)
        walk = [(os.path.dirname(root), [], [os.path.basename(root)])] \
            if os.path.isfile(root) else os.walk(root)
        for dirpath, dirs, files in walk:
            dirs[:] = [d for d in dirs if d not in cfg.get("ignore", [])]
            for name in files:
                path = os.path.join(dirpath, name)
                if os.path.islink(path):
                    continue
                try:
                    with open(path, "r", encoding="utf-8", newline="") as fh:
                        text = fh.read()
                except (UnicodeDecodeError, OSError):
                    continue
                new = text
                for old, repl in pairs:
                    new = new.replace(old, repl)
                if new != text:
                    with open(path, "w", encoding="utf-8", newline="") as fh:
                        fh.write(new)
                    changed += 1
                    if verbose:
                        print("  renamed in %s" % os.path.relpath(path, HERE))
    return changed


def apply_overlay(cfg, verbose):
    """Copy cfg["overlay"] (default overlay/) over the assembled tree."""
    src = os.path.join(HERE, cfg.get("overlay", "overlay"))
    if not os.path.isdir(src):
        return 0
    n = 0
    for dirpath, dirs, files in os.walk(src):
        for name in files:
            f = os.path.join(dirpath, name)
            rel = os.path.relpath(f, src)
            dst = os.path.join(HERE, rel)
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            shutil.copy2(f, dst)
            n += 1
            if verbose:
                print("  overlay %s" % rel)
    return n


def clean(cfg, verbose):
    removed = 0
    for dest in cfg["targets"]:
        dst = os.path.join(HERE, dest)
        if os.path.isfile(dst):
            os.remove(dst)
            removed += 1
        elif os.path.isdir(dst):
            shutil.rmtree(dst)
            removed += 1
            if verbose:
                print("  removed %s" % dest)
    return removed


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--config", default=os.path.join(HERE, "workspace.json"),
                    help="mapping file (default: workspace.json)")
    ap.add_argument("--repos-root", default=None,
                    help="directory holding the sibling repos "
                         "(default: repos_root from the config)")
    ap.add_argument("--check", action="store_true",
                    help="report what would be copied and whether every "
                         "source exists; make no changes")
    ap.add_argument("--pull", action="store_true",
                    help="git pull every micro-repo before assembling")
    ap.add_argument("--clean", action="store_true",
                    help="remove every assembled path instead of creating it")
    ap.add_argument("-v", "--verbose", action="store_true")
    args = ap.parse_args()

    cfg = load_config(args.config)
    repos_root = args.repos_root or os.path.join(HERE, cfg.get("repos_root", ".."))
    repos_root = os.path.normpath(repos_root)

    if args.clean:
        print("removed %d assembled paths" % clean(cfg, args.verbose))
        return 0

    if args.pull:
        stale = pull_repos(cfg, repos_root, args.verbose)
        for repo, why in stale:
            print("  could not pull %s: %s" % (repo, why), file=sys.stderr)

    print("assembling from %s" % repos_root)
    copied, missing = assemble(cfg, repos_root, args.check, args.verbose)
    verb = "would copy" if args.check else "copied"
    print("%s %d/%d targets" % (verb, copied, len(cfg["targets"])))
    if not args.check and not missing:
        print("renamed identifiers in %d files" % rename_tree(cfg, args.verbose))
        print("overlaid %d files" % apply_overlay(cfg, args.verbose))
    if missing:
        print("MISSING %d source paths:" % len(missing), file=sys.stderr)
        for dest, src in missing:
            print("  %-34s <- %s" % (dest, src), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
