/**
 * @file migrate.cpp
 * @brief Implementation of the migrate sub-command.
 * @copyright 2024 Nextra Contributors
 */

#include "migrate.h"
#include "migrate_helpers.h"

#include "migration-runner/backend/MigrationRunner.h"
#include "migration-runner/backend/MigrationRollback.h"
#include "migration-runner/backend/MigrationStatusQuery.h"

#include <drogon/drogon.h>
#include <fmt/core.h>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

namespace commands
{

static void doStatus()
{
    runMigrateLoop([] {
        services::MigrationStatusQuery::run(
            SERVICES_ROOT,
            [](const nlohmann::json& j) {
                fmt::print("{}\n", j.dump(2));
                drogon::app().quit();
            },
            [](drogon::HttpStatusCode,
               const std::string& msg) {
                spdlog::error("status: {}", msg);
                drogon::app().quit();
            });
    });
}

static void doDown()
{
    runMigrateLoop([] {
        services::MigrationRollback::run(
            SERVICES_ROOT,
            [](const nlohmann::json& j) {
                fmt::print("{}\n", j.dump(2));
                drogon::app().quit();
            },
            [](drogon::HttpStatusCode,
               const std::string& msg) {
                spdlog::error("rollback: {}", msg);
                drogon::app().quit();
            });
    });
}

static void doUp()
{
    runMigrateLoop([] {
        services::MigrationRunner runner{
            SERVICES_ROOT,
            GRAPH_PATH,
            BOOTSTRAP_SQL};
        runner.runMigrations(
            [](const nlohmann::json& j) {
                fmt::print("{}\n", j.dump(2));
                drogon::app().quit();
            },
            [](drogon::HttpStatusCode,
               const std::string& msg) {
                spdlog::error("migrate up: {}", msg);
                drogon::app().quit();
            });
    });
}

void cmdMigrate(bool up, bool down, bool status)
{
    if (status) {
        spdlog::info("Checking migration status...");
        doStatus();
        return;
    }
    if (down) {
        spdlog::info("Rolling back last migration...");
        doDown();
        return;
    }
    if (up) {
        spdlog::info("Applying pending migrations...");
        doUp();
        return;
    }
    fmt::print("No action specified.  "
               "Use --up, --down, or --status.\n");
}

} // namespace commands
