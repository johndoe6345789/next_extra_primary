/**
 * @file PackageRepoCmd.cpp
 * @brief Package repository lifecycle management.
 */

#include "PackageRepoCmd.h"
#include "ShellUtil.h"

#include <fmt/core.h>

#include <string>

namespace manager
{

static int startDb()
{
    auto state = capture(fmt::format(
        "docker inspect -f '{{{{.State.Running}}}}' {} "
        "2>/dev/null", PackageRepoCmd::kDbContainer));
    if (state == "true") return 0;

    shell("repo", fmt::format(
        "docker rm -f {} 2>/dev/null || true",
        PackageRepoCmd::kDbContainer));
    shell("repo", fmt::format(
        "docker volume create {}",
        PackageRepoCmd::kDbVol));

    return shell("repo", fmt::format(
        "docker run -d --name {} --network {} "
        "--mount type=volume,src={},dst=/var/lib/"
        "postgresql/data "
        "-e POSTGRES_DB=packagerepo "
        "-e POSTGRES_USER=packagerepo "
        "-e POSTGRES_PASSWORD=packagerepo "
        "postgres:16-alpine",
        PackageRepoCmd::kDbContainer,
        PackageRepoCmd::kNetwork,
        PackageRepoCmd::kDbVol));
}

int PackageRepoCmd::build()
{
    if (!checkDaemon()) return 1;
    fmt::print("[repo] Building backend image ...\n");
    return shell("repo",
        "docker build -t nextra-packagerepo "
        "-f tools/packagerepo/backend/Dockerfile "
        "tools/packagerepo");
}

int PackageRepoCmd::up()
{
    if (!checkDaemon()) return 1;

    auto state = capture(fmt::format(
        "docker inspect -f '{{{{.State.Running}}}}' {} "
        "2>/dev/null", kContainer));
    if (state == "true") {
        fmt::print("[repo] Already running\n");
        return 0;
    }

    shell("repo", fmt::format(
        "docker rm -f {} 2>/dev/null || true",
        kContainer));
    shell("repo", fmt::format(
        "docker network create {} 2>/dev/null || true",
        kNetwork));
    shell("repo", fmt::format(
        "docker volume create {}", kDataVol));

    if (startDb() != 0) return 1;

    int rc = shell("repo", fmt::format(
        "docker run -d --name {} --network {} "
        "-p {}:5000 "
        "--mount type=volume,src={},dst=/data "
        "-e DATABASE_URL='host={} port=5432 "
        "dbname=packagerepo user=packagerepo "
        "password=packagerepo' "
        "-e PGHOST={} -e PGPORT=5432 "
        "-e PGUSER=packagerepo "
        "-e PGPASSWORD=packagerepo "
        "-e PGDATABASE=packagerepo "
        "-e JWT_SECRET=dev-secret-key "
        "nextra-packagerepo",
        kContainer, kNetwork, kPort, kDataVol,
        kDbContainer, kDbContainer));

    if (rc == 0)
        fmt::print("[repo] Started on port {}\n", kPort);
    return rc;
}

int PackageRepoCmd::down()
{
    if (!checkDaemon()) return 1;
    fmt::print("[repo] Stopping stack ...\n");
    shell("repo", fmt::format(
        "docker rm -f {}", kContainer));
    shell("repo", fmt::format(
        "docker rm -f {}", kDbContainer));
    return 0;
}

int PackageRepoCmd::status()
{
    if (!checkDaemon()) return 1;
    for (auto c : {kContainer, kDbContainer}) {
        auto st = capture(fmt::format(
            "docker inspect -f '{{{{.State.Status}}}}' {} "
            "2>/dev/null", c));
        fmt::print("[repo] {}: {}\n", c,
                   st.empty() ? "not running" : st);
    }
    fmt::print("[repo] API: http://localhost:{}\n", kPort);
    return 0;
}

void PackageRepoCmd::registerAll(CLI::App& parent)
{
    auto* cmd = parent.add_subcommand(
        "repo", "Local package repository");
    cmd->require_subcommand(1);

    cmd->add_subcommand("build", "Build backend image")
        ->callback([]() { build(); });
    cmd->add_subcommand("up", "Start stack")
        ->callback([]() { up(); });
    cmd->add_subcommand("down", "Stop stack")
        ->callback([]() { down(); });
    cmd->add_subcommand("status", "Show status")
        ->callback([]() { status(); });
    cmd->add_subcommand("logs", "Tail logs")
        ->callback([]() {
            shell("repo", fmt::format(
                "docker logs -f --tail=100 {}",
                kContainer));
        });
}

} // namespace manager
