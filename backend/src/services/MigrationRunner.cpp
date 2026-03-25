/**
 * @file MigrationRunner.cpp
 * @brief MigrationRunner implementation.
 */

#include "services/MigrationRunner.h"
#include "services/MigrationApplier.h"
#include "services/MigrationFileUtils.h"
#include "services/MigrationStateStore.h"

#include <spdlog/spdlog.h>

#include <algorithm>
#include <vector>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

MigrationRunner::MigrationRunner(std::string migrationsDir)
    : migrationsDir_(std::move(migrationsDir))
{
}

void MigrationRunner::runMigrations(
    Callback onSuccess, ErrCallback onError)
{
    MigrationStateStore::ensureTable(
        [this, onSuccess, onError]() {
            auto allFiles =
                MigrationFileUtils::discoverFiles(migrationsDir_);
            if (allFiles.empty()) {
                onSuccess(json::array());
                return;
            }
            auto dbClient = MigrationStateStore::db();
            const std::string sql =
                "SELECT filename FROM schema_migrations "
                "ORDER BY filename";

            *dbClient << sql >>
                [this, allFiles, onSuccess,
                 onError](const Result& result) {
                    std::vector<std::string> applied;
                    for (const auto& row : result) {
                        applied.push_back(
                            row["filename"].as<std::string>());
                    }
                    std::vector<std::string> pending;
                    for (const auto& f : allFiles) {
                        if (std::ranges::find(applied, f)
                            == applied.end()) {
                            pending.push_back(f);
                        }
                    }
                    if (pending.empty()) {
                        spdlog::info("No pending migrations");
                        onSuccess(json::array());
                        return;
                    }
                    MigrationApplier::applyAll(
                        migrationsDir_, pending,
                        onSuccess, onError);
                } >>
                [onError](const DrogonDbException& e) {
                    spdlog::error("Fetch applied error: {}",
                                  e.base().what());
                    onError(k500InternalServerError,
                            "Internal server error");
                };
        },
        onError);
}

} // namespace services
