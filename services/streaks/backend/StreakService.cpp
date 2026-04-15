/**
 * @file StreakService.cpp
 * @brief Implementation of StreakService.
 */

#include "streaks/backend/StreakService.h"

#include <drogon/drogon.h>
#include <drogon/orm/DbClient.h>
#include <spdlog/spdlog.h>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

StreakService::StreakService(std::vector<std::int32_t> milestones)
    : milestones_(std::move(milestones))
{
}

auto StreakService::db() -> DbClientPtr
{
    return drogon::app().getDbClient();
}

void StreakService::updateStreak(const std::string& userId, Callback onSuccess,
                                 ErrCallback onError)
{
    const std::string sql = R"(
        WITH last_activity AS (
            SELECT last_active_date
            FROM users WHERE id = $1
        ),
        streak_calc AS (
            SELECT CASE
                WHEN la.last_active_date = CURRENT_DATE
                    THEN u.current_streak
                WHEN la.last_active_date
                     = CURRENT_DATE - 1
                    THEN u.current_streak + 1
                ELSE 1
            END AS new_streak
            FROM users u, last_activity la
            WHERE u.id = $1
        )
        UPDATE users
        SET current_streak =
                (SELECT new_streak FROM streak_calc),
            longest_streak = GREATEST(longest_streak,
                (SELECT new_streak FROM streak_calc)),
            last_active_date = CURRENT_DATE,
            updated_at = NOW()
        WHERE id = $1
        RETURNING current_streak, longest_streak
    )";

    auto dbClient = db();
    *dbClient << sql << userId >> [this, onSuccess](const Result& r) {
        if (r.empty()) {
            onSuccess({{"currentStreak", 0},
                       {"longestStreak", 0},
                       {"milestoneReached", false},
                       {"milestoneValue", 0}});
            return;
        }
        auto cur = r[0]["current_streak"].as<std::int32_t>();
        auto lng = r[0]["longest_streak"].as<std::int32_t>();
        bool hit = false;
        std::int32_t hitVal = 0;
        for (auto m : milestones_) {
            if (cur == m) {
                hit = true;
                hitVal = m;
                break;
            }
        }
        onSuccess({{"currentStreak", cur},
                   {"longestStreak", lng},
                   {"milestoneReached", hit},
                   {"milestoneValue", hitVal}});
    } >> [onError](const DrogonDbException& e) {
        spdlog::error("updateStreak DB error: {}", e.base().what());
        onError(k500InternalServerError, "Internal server error");
    };
}

} // namespace services
