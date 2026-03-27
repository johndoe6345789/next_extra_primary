/**
 * @file PackageRepoCmd.cpp
 * @brief Package repository lifecycle management.
 */

#include "PackageRepoCmd.h"
#include "S3Cmd.h"
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

/// Ensure the S3 server is up and on our network.
static int ensureS3()
{
    S3Cmd::up();
    shell("repo", fmt::format(
        "docker network connect {} {} "
        "2>/dev/null || true",
        PackageRepoCmd::kNetwork,
        S3Cmd::kContainer));
    return 0;
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

    if (startDb() != 0) return 1;
    ensureS3();

    int rc = shell("repo", fmt::format(
        "docker run -d --name {} --network {} "
        "-p {}:5000 "
        "-e S3_ENDPOINT=http://{}:9000 "
        "-e S3_BUCKET=packagerepo "
        "-e S3_ACCESS_KEY=minioadmin "
        "-e DATABASE_URL='host={} port=5432 "
        "dbname=packagerepo user=packagerepo "
        "password=packagerepo' "
        "-e PGHOST={} -e PGPORT=5432 "
        "-e PGUSER=packagerepo "
        "-e PGPASSWORD=packagerepo "
        "-e PGDATABASE=packagerepo "
        "-e JWT_SECRET=dev-secret-key "
        "nextra-packagerepo",
        kContainer, kNetwork, kPort,
        S3Cmd::kContainer,
        kDbContainer, kDbContainer));

    if (rc == 0)
        fmt::print("[repo] Started on port {}\n", kPort);
    return rc;
}

} // namespace manager
