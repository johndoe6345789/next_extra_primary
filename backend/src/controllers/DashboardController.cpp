/**
 * @file DashboardController.cpp
 * @brief Dashboard stats endpoint implementation.
 */

#include "DashboardController.h"
#include "../utils/JsonResponse.h"

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;
using namespace drogon;
using namespace drogon::orm;

namespace controllers
{

void DashboardController::stats(
    const HttpRequestPtr& req, Cb&& cb)
{
    auto userId = req->attributes()->get<
        std::string>("user_id");

    auto sql = R"(
        SELECT
            u.total_points,
            u.current_level,
            COALESCE(s.current_streak, 0)
                AS current_streak,
            COALESCE(s.longest_streak, 0)
                AS longest_streak,
            COUNT(DISTINCT ub.badge_id)
                AS badge_count,
            (SELECT COUNT(*) FROM notifications n
             WHERE n.user_id = u.id
               AND n.is_read = FALSE)
                AS unread_count,
            (SELECT RANK() OVER (
                 ORDER BY total_points DESC)
             FROM users
             WHERE id = u.id)
                AS rank
        FROM users u
        LEFT JOIN streaks s
            ON s.user_id = u.id
        LEFT JOIN user_badges ub
            ON ub.user_id = u.id
        WHERE u.id = $1
        GROUP BY u.id, s.current_streak,
                 s.longest_streak
    )";

    auto dbClient = app().getDbClient();
    *dbClient << sql << userId
              >> [cb](const Result& r) {
                     if (r.empty()) {
                         cb(::utils::jsonError(
                             k404NotFound,
                             "User not found"));
                         return;
                     }
                     const auto& row = r[0];
                     cb(::utils::jsonOk({
                         {"totalPoints",
                          row["total_points"]
                              .as<int64_t>()},
                         {"currentLevel",
                          row["current_level"]
                              .as<int32_t>()},
                         {"currentStreak",
                          row["current_streak"]
                              .as<int32_t>()},
                         {"longestStreak",
                          row["longest_streak"]
                              .as<int32_t>()},
                         {"badgeCount",
                          row["badge_count"]
                              .as<int64_t>()},
                         {"unreadNotifications",
                          row["unread_count"]
                              .as<int64_t>()},
                         {"rank",
                          row["rank"]
                              .as<int64_t>()},
                     }));
                 }
              >> [cb](const DrogonDbException& e) {
                     spdlog::error("dashboard: {}",
                                   e.base().what());
                     cb(::utils::jsonError(
                         k500InternalServerError,
                         "Internal server error"));
                 };
}

} // namespace controllers
