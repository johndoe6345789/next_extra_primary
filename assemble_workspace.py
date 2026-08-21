#!/usr/bin/env python3
"""Materialise this repo's source tree from the micro-repos that own it.

Commit 572da45 emptied services/, shared/ and frontend/ -- their content was
migrated out to sibling repos -- but the build system stayed here: the root
CMakeLists.txt globs services/<domain>/*.cpp, docker/nextra-api.Dockerfile
does `COPY . .`, and docker-compose.yml builds 30 images from ./services/...
paths. So the tree has to be reassembled before anything can build.

workspace.json holds the whole mapping; this file is just the mechanics.
"""
import argparse
import json
import os
import shutil
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))


def load_config(path):
    with open(path) as handle:
        return json.load(handle)


def source_of(cfg, repos_root, spec):
    parts = [repos_root, spec["repo"]]
    if spec["path"]:
        parts.append(spec["path"])
    return os.path.normpath(os.path.join(*parts))


def pull_repos(cfg, repos_root, verbose):
    """git pull each micro-repo, so a deploy picks up their latest code."""
    repos = sorted({spec["repo"] for spec in cfg["targets"].values()})
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
        src = source_of(cfg, repos_root, spec)
        dst = os.path.join(HERE, dest)
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


def clean(cfg, verbose):
    removed = 0
    for dest in cfg["targets"]:
        dst = os.path.join(HERE, dest)
        if os.path.isdir(dst):
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
    if missing:
        print("MISSING %d source paths:" % len(missing), file=sys.stderr)
        for dest, src in missing:
            print("  %-34s <- %s" % (dest, src), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
