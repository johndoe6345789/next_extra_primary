/**
 * @file MigrationStateStore.cpp
 * @brief schema_migrations table management implementation.
 */

#include "services/MigrationStateStore.h"

#include <spdlog/spdlog.h>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

auto MigrationStateStore::db() -> DbClientPtr
{
    return drogon::app().getDbClient();
}

void MigrationStateStore::ensureTable(std::function<void()> then,
                                      ErrCallback onError)
{
    auto dbClient = db();
    const std::string sql = R"(
        CREATE TABLE IF NOT EXISTS schema_migrations (
            id         SERIAL PRIMARY KEY,
            filename   TEXT UNIQUE NOT NULL,
            applied_at TIMESTAMPTZ NOT NULL
                       DEFAULT NOW()
        )
    )";

    *dbClient << sql >> [then](const Result&) { then(); } >>
        [onError](const DrogonDbException& e) {
            spdlog::error("ensureTable error: {}", e.base().what());
            onError(k500InternalServerError,
                    "Failed to create schema_migrations table");
        };
}

} // namespace services
