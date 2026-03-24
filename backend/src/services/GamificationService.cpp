/**
 * @file GamificationService.cpp
 * @brief Implementation of points, badges, streaks, and
 *        leaderboard logic.
 */

#include "services/GamificationService.h"

#include <drogon/drogon.h>
#include <drogon/orm/DbClient.h>
#include <spdlog/spdlog.h>
#include <fmt/format.h>

#include <algorithm>
#include <fstream>
#include <stdexcept>
#include <string>

namespace services {

using namespace drogon;
using namespace drogon::orm;

// ----------------------------------------------------------------
// Construction
// ----------------------------------------------------------------

GamificationService::GamificationService()
{
    // Load gamification config.
    try {
        std::ifstream ifs(
            "src/constants/gamification.json");
        if (!ifs.is_open()) {
            ifs.open("backend/src/constants/"
                     "gamification.json");
        }
        if (ifs.is_open()) {
            config_ = json::parse(ifs);
        } else {
            spdlog::warn(
                "gamification.json not found; "
                "using defaults");
            config_ = json::object();
        }
    } catch (const std::exception &e) {
        spdlog::error(
            "Failed to parse gamification.json: {}",
            e.what());
        config_ = json::object();
    }

    // Build levels table.
    if (config_.contains("levels")) {
        for (auto &lv : config_["levels"]) {
            levels_.push_back({
                lv.value("level", 1),
                lv.value("min_points",
                         static_cast<std::int64_t>(0)),
                lv.value("title", "Unknown")
            });
        }
    }
    // Ensure descending order for lookup.
    std::ranges::sort(levels_, [](auto &a, auto &b) {
        return a.minPoints > b.minPoints;
    });

    // Streak milestones.
    if (config_.contains("streaks")
        && config_["streaks"].contains("milestones")) {
        for (auto &m :
             config_["streaks"]["milestones"]) {
            milestones_.push_back(
                m.get<std::int32_t>());
        }
    }
    std::ranges::sort(milestones_);
}

auto GamificationService::db() -> DbClientPtr
{
    return drogon::app().getDbClient();
}

// ----------------------------------------------------------------
// Level helpers
// ----------------------------------------------------------------

auto GamificationService::getLevelForPoints(
    std::int64_t points) const -> std::int32_t
{
    for (const auto &lv : levels_) {
        if (points >= lv.minPoints) {
            return lv.level;
        }
    }
    return 1;
}

auto GamificationService::getLevelTitle(
    std::int32_t level) const -> std::string
{
    for (const auto &lv : levels_) {
        if (lv.level == level) {
            return lv.title;
        }
    }
    return "Newcomer";
}

auto GamificationService::pointsToNextLevel(
    std::int64_t currentPoints) const -> std::int64_t
{
    // levels_ is sorted descending by minPoints.
    // Find the *next* level above current.
    std::int64_t nextThreshold = 0;
    bool found = false;
    // Iterate ascending.
    for (auto it = levels_.rbegin();
         it != levels_.rend(); ++it) {
        if (it->minPoints > currentPoints) {
            nextThreshold = it->minPoints;
            found = true;
            break;
        }
    }
    if (!found) return 0;  // Already max level.
    return nextThreshold - currentPoints;
}

// ----------------------------------------------------------------
// awardPoints
// ----------------------------------------------------------------

void GamificationService::awardPoints(
    const std::string &userId,
    std::int64_t amount,
    const std::string &reason,
    const std::string &source,
    Callback onSuccess,
    ErrCallback onError)
{
    if (amount <= 0) {
        onError(k400BadRequest,
                "Amount must be positive");
        return;
    }

    auto dbClient = db();
    const std::string sql = R"(
        WITH inserted AS (
            INSERT INTO point_transactions
                (user_id, amount, reason, source,
                 created_at)
            VALUES ($1, $2, $3, $4, NOW())
            RETURNING user_id
        )
        UPDATE users
        SET total_points = total_points + $2,
            updated_at   = NOW()
        WHERE id = $1
        RETURNING total_points
    )";

    *dbClient << sql
        << userId << amount << reason << source
        >> [onSuccess, this](const Result &result) {
            if (result.empty()) {
                onSuccess({{"newTotal", 0}});
                return;
            }
            auto newTotal =
                result[0]["total_points"]
                    .as<std::int64_t>();
            onSuccess({{"newTotal", newTotal}});
        }
        >> [onError](const DrogonDbException &e) {
            spdlog::error(
                "awardPoints DB error: {}",
                e.base().what());
            onError(k500InternalServerError,
                    "Internal server error");
        };
}

// ----------------------------------------------------------------
// checkAndAwardBadges
// ----------------------------------------------------------------

void GamificationService::checkAndAwardBadges(
    const std::string &userId,
    Callback onSuccess,
    ErrCallback onError)
{
    auto dbClient = db();

    // Fetch user stats needed for badge evaluation.
    const std::string statsSql = R"(
        SELECT u.total_points, u.current_streak,
               u.longest_streak,
               COUNT(DISTINCT cm.id) AS msg_count,
               COUNT(DISTINCT ub.badge_id)
                   AS badge_count
        FROM users u
        LEFT JOIN chat_messages cm
            ON cm.user_id = u.id
        LEFT JOIN user_badges ub
            ON ub.user_id = u.id
        WHERE u.id = $1
        GROUP BY u.id
    )";

    *dbClient << statsSql << userId
        >> [this, userId, onSuccess, onError](
               const Result &stats) {
            if (stats.empty()) {
                onSuccess(json::array());
                return;
            }
            auto points =
                stats[0]["total_points"]
                    .as<std::int64_t>();
            auto streak =
                stats[0]["current_streak"]
                    .as<std::int32_t>();
            auto msgCount =
                stats[0]["msg_count"]
                    .as<std::int64_t>();

            // Build candidate badge list.
            json candidates = json::array();
            if (points >= 100) {
                candidates.push_back(
                    {{"slug", "first_100_points"},
                     {"name", "Century"},
                     {"description",
                      "Earned 100 points"}});
            }
            if (points >= 1000) {
                candidates.push_back(
                    {{"slug", "first_1000_points"},
                     {"name", "Millennial"},
                     {"description",
                      "Earned 1000 points"}});
            }
            if (streak >= 7) {
                candidates.push_back(
                    {{"slug", "streak_7"},
                     {"name", "Week Warrior"},
                     {"description",
                      "7-day streak"}});
            }
            if (streak >= 30) {
                candidates.push_back(
                    {{"slug", "streak_30"},
                     {"name", "Monthly Master"},
                     {"description",
                      "30-day streak"}});
            }
            if (msgCount >= 10) {
                candidates.push_back(
                    {{"slug", "chatty_10"},
                     {"name", "Conversationalist"},
                     {"description",
                      "Sent 10 chat messages"}});
            }
            if (msgCount >= 100) {
                candidates.push_back(
                    {{"slug", "chatty_100"},
                     {"name", "Chatterbox"},
                     {"description",
                      "Sent 100 chat messages"}});
            }

            if (candidates.empty()) {
                onSuccess(json::array());
                return;
            }

            // Insert only new badges.
            auto dbInner = db();
            json newBadges = json::array();
            auto remaining =
                std::make_shared<std::size_t>(
                    candidates.size());
            auto result =
                std::make_shared<json>(
                    json::array());

            for (auto &badge : candidates) {
                auto slug =
                    badge["slug"]
                        .get<std::string>();
                auto name =
                    badge["name"]
                        .get<std::string>();
                auto desc =
                    badge["description"]
                        .get<std::string>();

                const std::string ins = R"(
                    INSERT INTO badges
                        (slug, name, description)
                    VALUES ($1, $2, $3)
                    ON CONFLICT (slug) DO UPDATE
                        SET slug = EXCLUDED.slug
                    RETURNING id
                )";

                *dbInner << ins
                    << slug << name << desc
                    >> [dbInner, userId, badge,
                        remaining, result,
                        onSuccess](
                           const Result &br) {
                        if (br.empty()) {
                            if (--(*remaining) == 0) {
                                onSuccess(*result);
                            }
                            return;
                        }
                        auto badgeId =
                            br[0]["id"]
                                .as<std::string>();

                        const std::string link =
                            R"(
                            INSERT INTO user_badges
                                (user_id, badge_id,
                                 earned_at)
                            VALUES ($1, $2, NOW())
                            ON CONFLICT DO NOTHING
                            RETURNING badge_id
                        )";

                        *dbInner << link
                            << userId << badgeId
                            >> [badge, remaining,
                                result, onSuccess](
                                   const Result &lr) {
                                if (!lr.empty()) {
                                    result->push_back(
                                        badge);
                                }
                                if (--(*remaining)
                                    == 0) {
                                    onSuccess(
                                        *result);
                                }
                            }
                            >> [remaining, result,
                                onSuccess](
                                   const DrogonDbException
                                       &) {
                                if (--(*remaining)
                                    == 0) {
                                    onSuccess(
                                        *result);
                                }
                            };
                    }
                    >> [remaining, result,
                        onSuccess](
                           const DrogonDbException &) {
                        if (--(*remaining) == 0) {
                            onSuccess(*result);
                        }
                    };
            }
        }
        >> [onError](const DrogonDbException &e) {
            spdlog::error(
                "checkAndAwardBadges DB error: {}",
                e.base().what());
            onError(k500InternalServerError,
                    "Internal server error");
        };
}

// ----------------------------------------------------------------
// updateStreak
// ----------------------------------------------------------------

void GamificationService::updateStreak(
    const std::string &userId,
    Callback onSuccess,
    ErrCallback onError)
{
    auto dbClient = db();

    // Upsert today's activity and compute streak.
    const std::string sql = R"(
        WITH last_activity AS (
            SELECT last_active_date
            FROM users WHERE id = $1
        ),
        streak_calc AS (
            SELECT
                CASE
                    WHEN la.last_active_date
                         = CURRENT_DATE
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
                (SELECT new_streak
                 FROM streak_calc),
            longest_streak = GREATEST(
                longest_streak,
                (SELECT new_streak
                 FROM streak_calc)),
            last_active_date = CURRENT_DATE,
            updated_at = NOW()
        WHERE id = $1
        RETURNING current_streak, longest_streak
    )";

    *dbClient << sql << userId
        >> [this, onSuccess](const Result &result) {
            if (result.empty()) {
                onSuccess({
                    {"currentStreak", 0},
                    {"longestStreak", 0},
                    {"milestoneReached", false},
                    {"milestoneValue", 0}
                });
                return;
            }
            auto current =
                result[0]["current_streak"]
                    .as<std::int32_t>();
            auto longest =
                result[0]["longest_streak"]
                    .as<std::int32_t>();

            // Check if a milestone was just hit.
            bool milestone = false;
            std::int32_t milestoneVal = 0;
            for (auto m : milestones_) {
                if (current == m) {
                    milestone = true;
                    milestoneVal = m;
                    break;
                }
            }

            onSuccess({
                {"currentStreak", current},
                {"longestStreak", longest},
                {"milestoneReached", milestone},
                {"milestoneValue", milestoneVal}
            });
        }
        >> [onError](const DrogonDbException &e) {
            spdlog::error(
                "updateStreak DB error: {}",
                e.base().what());
            onError(k500InternalServerError,
                    "Internal server error");
        };
}

// ----------------------------------------------------------------
// getLeaderboard
// ----------------------------------------------------------------

void GamificationService::getLeaderboard(
    const std::string &period,
    std::int32_t limit,
    Callback onSuccess,
    ErrCallback onError)
{
    auto dbClient = db();

    std::string dateFilter;
    if (period == "weekly") {
        dateFilter =
            "AND pt.created_at >= "
            "DATE_TRUNC('week', NOW())";
    } else if (period == "monthly") {
        dateFilter =
            "AND pt.created_at >= "
            "DATE_TRUNC('month', NOW())";
    }
    // "all" uses no date filter.

    auto sql = fmt::format(R"(
        SELECT u.id, u.username, u.total_points,
               COALESCE(SUM(pt.amount), 0)
                   AS period_points
        FROM users u
        LEFT JOIN point_transactions pt
            ON pt.user_id = u.id {}
        GROUP BY u.id, u.username, u.total_points
        ORDER BY period_points DESC
        LIMIT $1
    )", dateFilter);

    *dbClient << sql << limit
        >> [this, onSuccess](const Result &result) {
            json entries = json::array();
            std::int32_t rank = 1;
            for (const auto &row : result) {
                auto pts =
                    row["total_points"]
                        .as<std::int64_t>();
                entries.push_back({
                    {"userId",
                     row["id"].as<std::string>()},
                    {"username",
                     row["username"]
                         .as<std::string>()},
                    {"points",
                     row["period_points"]
                         .as<std::int64_t>()},
                    {"totalPoints", pts},
                    {"level",
                     getLevelForPoints(pts)},
                    {"rank", rank++}
                });
            }
            onSuccess(entries);
        }
        >> [onError](const DrogonDbException &e) {
            spdlog::error(
                "getLeaderboard DB error: {}",
                e.base().what());
            onError(k500InternalServerError,
                    "Internal server error");
        };
}

// ----------------------------------------------------------------
// getUserProgress
// ----------------------------------------------------------------

void GamificationService::getUserProgress(
    const std::string &userId,
    Callback onSuccess,
    ErrCallback onError)
{
    auto dbClient = db();
    const std::string sql = R"(
        SELECT u.total_points, u.current_streak,
               u.longest_streak,
               COALESCE(
                   json_agg(
                       json_build_object(
                           'slug', b.slug,
                           'name', b.name,
                           'earnedAt', ub.earned_at
                       )
                   ) FILTER (
                       WHERE b.id IS NOT NULL
                   ),
                   '[]'::json
               ) AS badges
        FROM users u
        LEFT JOIN user_badges ub
            ON ub.user_id = u.id
        LEFT JOIN badges b
            ON b.id = ub.badge_id
        WHERE u.id = $1
        GROUP BY u.id
    )";

    *dbClient << sql << userId
        >> [this, onSuccess, onError](
               const Result &result) {
            if (result.empty()) {
                onError(k404NotFound,
                        "User not found");
                return;
            }
            auto pts =
                result[0]["total_points"]
                    .as<std::int64_t>();
            auto level = getLevelForPoints(pts);
            auto nextLevelPts =
                pointsToNextLevel(pts);

            json badges;
            try {
                badges = json::parse(
                    result[0]["badges"]
                        .as<std::string>());
            } catch (...) {
                badges = json::array();
            }

            onSuccess({
                {"level", level},
                {"levelTitle",
                 getLevelTitle(level)},
                {"points", pts},
                {"nextLevelAt",
                 pts + nextLevelPts},
                {"pointsToNextLevel",
                 nextLevelPts},
                {"currentStreak",
                 result[0]["current_streak"]
                     .as<std::int32_t>()},
                {"longestStreak",
                 result[0]["longest_streak"]
                     .as<std::int32_t>()},
                {"badges", badges}
            });
        }
        >> [onError](const DrogonDbException &e) {
            spdlog::error(
                "getUserProgress DB error: {}",
                e.base().what());
            onError(k500InternalServerError,
                    "Internal server error");
        };
}

}  // namespace services
