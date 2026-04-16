/**
 * @file migration_runner_bootstrap.cpp
 * @brief Bootstrap implementation for domain-sliced migrations.
 */

#include "migration-runner/backend/migration_runner_bootstrap.h"
#include "migration-runner/backend/MigrationStateStore.h"

#include <spdlog/spdlog.h>

namespace services::migrations
{

using namespace drogon;
using namespace drogon::orm;

static void retroStamp(
    std::function<void()> then,
    services::ErrCallback onError)
{
    auto db = services::MigrationStateStore::db();
    const std::string sql =
        "UPDATE schema_migrations "
        "SET domain='legacy' "
        "WHERE domain IS NULL";
    *db << sql
        >> [then](const Result&) { then(); }
        >> [onError](const DrogonDbException& e) {
            spdlog::error("retroStamp: {}",
                          e.base().what());
            onError(k500InternalServerError,
                    "Failed to retro-stamp legacy rows");
        };
}

static void applyBootstrap(
    const std::string& bootstrapSql,
    std::function<void()> then,
    services::ErrCallback onError)
{
    auto db = services::MigrationStateStore::db();
    *db << bootstrapSql
        >> [then, onError](const Result&) {
            retroStamp(then, onError);
        }
        >> [onError](const DrogonDbException& e) {
            spdlog::error("bootstrap sql: {}",
                          e.base().what());
            onError(k500InternalServerError,
                    "Failed to apply bootstrap SQL");
        };
}

void MigrationRunnerBootstrap::run(
    const std::string& bootstrapSql,
    std::function<void()> then,
    services::ErrCallback onError)
{
    auto db = services::MigrationStateStore::db();
    const std::string check =
        "SELECT column_name "
        "FROM information_schema.columns "
        "WHERE table_name='schema_migrations' "
        "  AND column_name='domain'";
    *db << check
        >> [bootstrapSql, then, onError](
               const Result& r) {
            if (!r.empty()) {
                spdlog::info(
                    "Bootstrap already applied");
                then();
                return;
            }
            applyBootstrap(bootstrapSql, then, onError);
        }
        >> [onError](const DrogonDbException& e) {
            spdlog::error("bootstrap check: {}",
                          e.base().what());
            onError(k500InternalServerError,
                    "Failed to check bootstrap state");
        };
}

} // namespace services::migrations
