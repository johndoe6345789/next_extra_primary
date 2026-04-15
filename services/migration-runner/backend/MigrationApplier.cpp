/**
 * @file MigrationApplier.cpp
 * @brief Sequential migration-apply loop implementation.
 */

#include "migration-runner/backend/MigrationApplier.h"
#include "migration-runner/backend/MigrationFileUtils.h"
#include "migration-runner/backend/MigrationStateStore.h"

#include <fmt/format.h>
#include <spdlog/spdlog.h>

#include <functional>
#include <memory>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

void MigrationApplier::applyAll(const std::string& migrationsDir,
                                std::vector<std::string> pending,
                                Callback onSuccess, ErrCallback onError)
{
    auto idx = std::make_shared<std::size_t>(0);
    auto done = std::make_shared<json>(json::array());

    auto applyNext = std::make_shared<std::function<void()>>();
    *applyNext = [migrationsDir, pending, idx, done, onSuccess, onError,
                  applyNext]() {
        if (*idx >= pending.size()) {
            onSuccess(*done);
            return;
        }
        auto fn = pending[*idx];
        auto path = fmt::format("{}/{}", migrationsDir, fn);
        std::string upSql;
        try {
            upSql = MigrationFileUtils::extractUp(
                MigrationFileUtils::readFile(path));
        } catch (const std::exception& e) {
            onError(k500InternalServerError,
                    fmt::format("Cannot read {}: {}", fn, e.what()));
            return;
        }
        auto trans = MigrationStateStore::db()->newTransaction();
        const std::string ins =
            "INSERT INTO schema_migrations(filename) VALUES ($1)";
        *trans << upSql >> [trans, fn, ins, idx, done, onSuccess, onError,
                            applyNext](const Result&) {
            *trans << ins << fn >> [fn, idx, done, onSuccess, onError,
                                    applyNext](const Result&) {
                spdlog::info("Applied: {}", fn);
                done->push_back(fn);
                ++(*idx);
                (*applyNext)();
            } >> [fn, onError](const DrogonDbException& e) {
                spdlog::error("Record {} error: {}", fn, e.base().what());
                onError(k500InternalServerError,
                        fmt::format("Failed to record {}", fn));
            };
        } >> [fn, onError](const DrogonDbException& e) {
            spdlog::error("Migration {} failed: {}", fn, e.base().what());
            onError(
                k500InternalServerError,
                fmt::format("Migration {} failed: {}", fn, e.base().what()));
        };
    };

    (*applyNext)();
}

} // namespace services
