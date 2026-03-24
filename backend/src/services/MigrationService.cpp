/**
 * @file MigrationService.cpp
 * @brief SQL migration runner implementation.
 */

#include "services/MigrationService.h"

#include <drogon/drogon.h>
#include <drogon/orm/DbClient.h>
#include <fmt/format.h>
#include <spdlog/spdlog.h>

#include <algorithm>
#include <filesystem>
#include <fstream>
#include <sstream>
#include <stdexcept>
#include <string>

namespace fs = std::filesystem;

namespace services
{

using namespace drogon;
using namespace drogon::orm;

// ----------------------------------------------------------------
// Construction
// ----------------------------------------------------------------

MigrationService::MigrationService(std::string migrationsDir)
    : migrationsDir_(std::move(migrationsDir))
{
}

auto MigrationService::db() -> DbClientPtr
{
    return drogon::app().getDbClient();
}

// ----------------------------------------------------------------
// File utilities
// ----------------------------------------------------------------

auto MigrationService::discoverFiles() const -> std::vector<std::string>
{
    std::vector<std::string> files;
    if (!fs::exists(migrationsDir_) || !fs::is_directory(migrationsDir_)) {
        spdlog::warn("Migrations directory not found: {}", migrationsDir_);
        return files;
    }

    for (const auto& entry : fs::directory_iterator(migrationsDir_)) {
        if (entry.is_regular_file() && entry.path().extension() == ".sql") {
            files.push_back(entry.path().filename().string());
        }
    }
    std::ranges::sort(files);
    return files;
}

auto MigrationService::readFile(const std::string& path) -> std::string
{
    std::ifstream ifs(path);
    if (!ifs.is_open()) {
        throw std::runtime_error(fmt::format("Cannot open file: {}", path));
    }
    std::ostringstream ss;
    ss << ifs.rdbuf();
    return ss.str();
}

auto MigrationService::extractUp(const std::string& sql) -> std::string
{
    auto pos = sql.find("-- DOWN");
    if (pos == std::string::npos) {
        return sql; // Entire file is the UP section.
    }
    return sql.substr(0, pos);
}

auto MigrationService::extractDown(const std::string& sql) -> std::string
{
    auto pos = sql.find("-- DOWN");
    if (pos == std::string::npos) {
        return {};
    }
    // Skip the "-- DOWN" line itself.
    auto lineEnd = sql.find('\n', pos);
    if (lineEnd == std::string::npos) {
        return {};
    }
    return sql.substr(lineEnd + 1);
}

// ----------------------------------------------------------------
// Ensure tracking table
// ----------------------------------------------------------------

void MigrationService::ensureTable(std::function<void()> then,
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
            onError(k500InternalServerError, "Failed to create "
                                             "schema_migrations table");
        };
}

// ----------------------------------------------------------------
// runMigrations
// ----------------------------------------------------------------

void MigrationService::runMigrations(Callback onSuccess, ErrCallback onError)
{
    ensureTable(
        [this, onSuccess, onError]() {
            auto allFiles = discoverFiles();
            if (allFiles.empty()) {
                onSuccess(json::array());
                return;
            }

            auto dbClient = db();

            // Fetch already-applied filenames.
            const std::string sql = R"(
                SELECT filename
                FROM schema_migrations
                ORDER BY filename
            )";

            *dbClient << sql >> [this, allFiles, onSuccess,
                                 onError](const Result& result) {
                std::vector<std::string> applied;
                for (const auto& row : result) {
                    applied.push_back(row["filename"].as<std::string>());
                }

                // Filter to pending only.
                std::vector<std::string> pending;
                for (const auto& f : allFiles) {
                    if (std::ranges::find(applied, f) == applied.end()) {
                        pending.push_back(f);
                    }
                }

                if (pending.empty()) {
                    spdlog::info("No pending migrations");
                    onSuccess(json::array());
                    return;
                }

                // Apply each migration
                // sequentially using a shared
                // counter.
                auto idx = std::make_shared<std::size_t>(0);
                auto applied2 = std::make_shared<json>(json::array());

                std::function<void()> applyNext;
                applyNext = [this, pending, idx, applied2, onSuccess, onError,
                             &applyNext]() {
                    if (*idx >= pending.size()) {
                        onSuccess(*applied2);
                        return;
                    }

                    auto filename = pending[*idx];
                    auto path = fmt::format("{}/{}", migrationsDir_, filename);

                    std::string upSql;
                    try {
                        auto full = readFile(path);
                        upSql = extractUp(full);
                    } catch (const std::exception& e) {
                        onError(k500InternalServerError,
                                fmt::format("Cannot read "
                                            "{}: {}",
                                            filename, e.what()));
                        return;
                    }

                    auto dbC = db();
                    auto trans = dbC->newTransaction();

                    *trans << upSql >> [trans, filename, idx, applied2,
                                        onSuccess, onError,
                                        &applyNext](const Result&) {
                        // Record it.
                        const std::string ins = R"(
                                    INSERT INTO
                                        schema_migrations
                                        (filename)
                                    VALUES ($1)
                                )";

                        *trans << ins << filename >>
                            [filename, idx, applied2, onSuccess, onError,
                             &applyNext](const Result&) {
                                spdlog::info("Applied "
                                             "migration"
                                             ": {}",
                                             filename);
                                applied2->push_back(filename);
                                ++(*idx);
                                applyNext();
                            } >>
                            [filename, onError](const DrogonDbException& e) {
                                spdlog::error("Record "
                                              "migration"
                                              " error "
                                              "{}: {}",
                                              filename, e.base().what());
                                onError(k500InternalServerError,
                                        fmt::format("Failed"
                                                    " to "
                                                    "record"
                                                    " {}",
                                                    filename));
                            };
                    } >> [filename, onError](const DrogonDbException& e) {
                        spdlog::error("Migration {} "
                                      "failed: {}",
                                      filename, e.base().what());
                        onError(k500InternalServerError,
                                fmt::format("Migration "
                                            "{} failed:"
                                            " {}",
                                            filename, e.base().what()));
                    };
                };

                applyNext();
            } >> [onError](const DrogonDbException& e) {
                spdlog::error("Fetch applied migrations "
                              "error: {}",
                              e.base().what());
                onError(k500InternalServerError, "Internal server error");
            };
        },
        onError);
}

// ----------------------------------------------------------------
// rollbackLast
// ----------------------------------------------------------------

void MigrationService::rollbackLast(Callback onSuccess, ErrCallback onError)
{
    ensureTable(
        [this, onSuccess, onError]() {
            auto dbClient = db();
            const std::string sql = R"(
                SELECT filename
                FROM schema_migrations
                ORDER BY applied_at DESC
                LIMIT 1
            )";

            *dbClient << sql >> [this, onSuccess,
                                 onError](const Result& result) {
                if (result.empty()) {
                    onError(k404NotFound, "No migrations to "
                                          "roll back");
                    return;
                }

                auto filename = result[0]["filename"].as<std::string>();
                auto path = fmt::format("{}/{}", migrationsDir_, filename);

                std::string downSql;
                try {
                    auto full = readFile(path);
                    downSql = extractDown(full);
                } catch (const std::exception& e) {
                    onError(
                        k500InternalServerError,
                        fmt::format("Cannot read {}: {}", filename, e.what()));
                    return;
                }

                if (downSql.empty()) {
                    onError(k400BadRequest, fmt::format("{} has no "
                                                        "DOWN section",
                                                        filename));
                    return;
                }

                auto dbC = db();
                auto trans = dbC->newTransaction();

                *trans << downSql >> [trans, filename, onSuccess,
                                      onError](const Result&) {
                    const std::string del =
                        R"(
                                DELETE FROM
                                    schema_migrations
                                WHERE filename = $1
                            )";

                    *trans << del << filename >> [filename,
                                                  onSuccess](const Result&) {
                        spdlog::info("Rolled back"
                                     ": {}",
                                     filename);
                        onSuccess({{"filename", filename}});
                    } >> [onError](const DrogonDbException& e) {
                        onError(k500InternalServerError, e.base().what());
                    };
                } >> [filename, onError](const DrogonDbException& e) {
                    spdlog::error("Rollback {} "
                                  "failed: {}",
                                  filename, e.base().what());
                    onError(k500InternalServerError,
                            fmt::format("Rollback {} "
                                        "failed: {}",
                                        filename, e.base().what()));
                };
            } >> [onError](const DrogonDbException& e) {
                spdlog::error("rollbackLast query "
                              "error: {}",
                              e.base().what());
                onError(k500InternalServerError, "Internal server error");
            };
        },
        onError);
}

// ----------------------------------------------------------------
// getMigrationStatus
// ----------------------------------------------------------------

void MigrationService::getMigrationStatus(Callback onSuccess,
                                          ErrCallback onError)
{
    ensureTable(
        [this, onSuccess, onError]() {
            auto allFiles = discoverFiles();

            auto dbClient = db();
            const std::string sql = R"(
                SELECT filename, applied_at
                FROM schema_migrations
                ORDER BY filename
            )";

            *dbClient << sql >> [allFiles, onSuccess](const Result& result) {
                // Build a map of applied ones.
                std::unordered_map<std::string, std::string> appliedMap;
                for (const auto& row : result) {
                    appliedMap[row["filename"].as<std::string>()] =
                        row["applied_at"].as<std::string>();
                }

                json statuses = json::array();
                for (const auto& f : allFiles) {
                    auto it = appliedMap.find(f);
                    if (it != appliedMap.end()) {
                        statuses.push_back({{"filename", f},
                                            {"appliedAt", it->second},
                                            {"pending", false}});
                    } else {
                        statuses.push_back({{"filename", f},
                                            {"appliedAt", nullptr},
                                            {"pending", true}});
                    }
                }
                onSuccess(statuses);
            } >> [onError](const DrogonDbException& e) {
                spdlog::error("getMigrationStatus "
                              "error: {}",
                              e.base().what());
                onError(k500InternalServerError, "Internal server error");
            };
        },
        onError);
}

} // namespace services
