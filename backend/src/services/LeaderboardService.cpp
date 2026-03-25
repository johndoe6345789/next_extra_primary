/**
 * @file LeaderboardService.cpp
 * @brief Implementation of LeaderboardService.
 */

#include "services/LeaderboardService.h"

#include <drogon/drogon.h>
#include <drogon/orm/DbClient.h>
#include <fmt/format.h>
#include <spdlog/spdlog.h>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

LeaderboardService::LeaderboardService(const LevelService* levels)
    : levels_(levels)
{
}

auto LeaderboardService::db() -> DbClientPtr
{
    return drogon::app().getDbClient();
}

void LeaderboardService::getLeaderboard(const std::string& period,
                                        std::int32_t limit, Callback onSuccess,
                                        ErrCallback onError)
{
    std::string dateFilter;
    if (period == "weekly") {
        dateFilter = "AND pt.created_at >= "
                     "DATE_TRUNC('week', NOW())";
    } else if (period == "monthly") {
        dateFilter = "AND pt.created_at >= "
                     "DATE_TRUNC('month', NOW())";
    }

    auto sql = fmt::format(R"(
        SELECT u.id, u.username,
               u.total_points,
               COALESCE(SUM(pt.amount), 0)
                   AS period_points
        FROM users u
        LEFT JOIN point_transactions pt
            ON pt.user_id = u.id {}
        GROUP BY u.id, u.username,
                 u.total_points
        ORDER BY period_points DESC
        LIMIT $1
    )",
                           dateFilter);

    auto dbClient = db();
    *dbClient << sql << limit >> [this, onSuccess](const Result& result) {
        json entries = json::array();
        std::int32_t rank = 1;
        for (const auto& row : result) {
            auto pts = row["total_points"].as<std::int64_t>();
            entries.push_back(
                {{"userId", row["id"].as<std::string>()},
                 {"username", row["username"].as<std::string>()},
                 {"points", row["period_points"].as<std::int64_t>()},
                 {"totalPoints", pts},
                 {"level", levels_->getLevelForPoints(pts)},
                 {"rank", rank++}});
        }
        onSuccess(entries);
    } >> [onError](const DrogonDbException& e) {
        spdlog::error("getLeaderboard DB error: {}", e.base().what());
        onError(k500InternalServerError, "Internal server error");
    };
}

} // namespace services
