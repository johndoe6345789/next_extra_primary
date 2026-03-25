/**
 * @file XpService.cpp
 * @brief Implementation of XpService::awardPoints.
 */

#include "services/XpService.h"

#include <drogon/drogon.h>
#include <drogon/orm/DbClient.h>
#include <spdlog/spdlog.h>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

auto XpService::db() -> DbClientPtr
{
    return drogon::app().getDbClient();
}

void XpService::awardPoints(const std::string& userId, std::int64_t amount,
                            const std::string& reason,
                            const std::string& source, Callback onSuccess,
                            ErrCallback onError)
{
    if (amount <= 0) {
        onError(k400BadRequest, "Amount must be positive");
        return;
    }

    auto dbClient = db();
    const std::string sql = R"(
        WITH inserted AS (
            INSERT INTO point_transactions
                (user_id, amount, reason,
                 source, created_at)
            VALUES ($1, $2, $3, $4, NOW())
            RETURNING user_id
        )
        UPDATE users
        SET total_points = total_points + $2,
            updated_at   = NOW()
        WHERE id = $1
        RETURNING total_points
    )";

    *dbClient << sql << userId << amount << reason << source >>
        [onSuccess](const Result& result) {
            if (result.empty()) {
                onSuccess({{"newTotal", 0}});
                return;
            }
            auto newTotal = result[0]["total_points"].as<std::int64_t>();
            onSuccess({{"newTotal", newTotal}});
        } >>
        [onError](const DrogonDbException& e) {
            spdlog::error("awardPoints DB error: {}", e.base().what());
            onError(k500InternalServerError, "Internal server error");
        };
}

} // namespace services
