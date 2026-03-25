/**
 * @file ProgressService.cpp
 * @brief Implementation of ProgressService.
 */

#include "services/ProgressService.h"

#include <drogon/drogon.h>
#include <drogon/orm/DbClient.h>
#include <spdlog/spdlog.h>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

ProgressService::ProgressService(const LevelService* levels) : levels_(levels)
{
}

auto ProgressService::db() -> DbClientPtr
{
    return drogon::app().getDbClient();
}

void ProgressService::getUserProgress(const std::string& userId,
                                      Callback onSuccess, ErrCallback onError)
{
    const std::string sql = R"(
        SELECT u.total_points,
               u.current_streak,
               u.longest_streak,
               COALESCE(json_agg(
                   json_build_object(
                       'slug', b.slug,
                       'name', b.name,
                       'earnedAt', ub.earned_at)
               ) FILTER (WHERE b.id IS NOT NULL),
               '[]'::json) AS badges
        FROM users u
        LEFT JOIN user_badges ub
            ON ub.user_id = u.id
        LEFT JOIN badges b ON b.id = ub.badge_id
        WHERE u.id = $1
        GROUP BY u.id
    )";

    auto dbClient = db();
    *dbClient << sql << userId >> [this, onSuccess, onError](const Result& r) {
        if (r.empty()) {
            onError(k404NotFound, "User not found");
            return;
        }
        auto pts = r[0]["total_points"].as<std::int64_t>();
        auto level = levels_->getLevelForPoints(pts);
        auto toNext = levels_->pointsToNextLevel(pts);
        json badges;
        try {
            badges = json::parse(r[0]["badges"].as<std::string>());
        } catch (...) {
            badges = json::array();
        }
        onSuccess({{"level", level},
                   {"levelTitle", levels_->getLevelTitle(level)},
                   {"points", pts},
                   {"nextLevelAt", pts + toNext},
                   {"pointsToNextLevel", toNext},
                   {"currentStreak", r[0]["current_streak"].as<std::int32_t>()},
                   {"longestStreak", r[0]["longest_streak"].as<std::int32_t>()},
                   {"badges", badges}});
    } >> [onError](const DrogonDbException& e) {
        spdlog::error("getUserProgress DB error: {}", e.base().what());
        onError(k500InternalServerError, "Internal server error");
    };
}

} // namespace services
