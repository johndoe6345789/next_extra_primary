#pragma once
/**
 * @file GamificationService.h
 * @brief Points, badges, streaks, levels, and leaderboards.
 *
 * Drives the gamification layer: awards points for user
 * actions, checks badge criteria, maintains daily streaks,
 * and builds leaderboards.  Level thresholds are loaded from
 * `constants/gamification.json`.
 */

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>

#include <cstdint>
#include <functional>
#include <string>
#include <vector>

namespace services {

using json = nlohmann::json;
using DbClientPtr = drogon::orm::DbClientPtr;
using Callback = std::function<void(json)>;
using ErrCallback =
    std::function<void(drogon::HttpStatusCode,
                       std::string)>;

/**
 * @brief Lightweight value object returned by
 *        `updateStreak`.
 */
struct StreakInfo {
    std::int32_t currentStreak{0};
    std::int32_t longestStreak{0};
    bool milestonReached{false};
    std::int32_t milestoneValue{0};
};

/**
 * @brief Single entry on the leaderboard.
 */
struct LeaderboardEntry {
    std::string userId;
    std::string username;
    std::int64_t points{0};
    std::int32_t level{1};
    std::int32_t rank{0};
};

/**
 * @class GamificationService
 * @brief Manages the full gamification lifecycle.
 */
class GamificationService {
public:
    GamificationService();
    ~GamificationService() = default;

    // -------------------------------------------------------
    // Points
    // -------------------------------------------------------

    /**
     * @brief Award points to a user.
     *
     * Inserts a `point_transactions` row and updates the
     * aggregate total on the `users` row.
     *
     * @param userId   Target user ID.
     * @param amount   Number of points to add.
     * @param reason   Human-readable reason string.
     * @param source   Machine key (e.g. "login",
     *                 "chat_message").
     * @param onSuccess Callback with `{newTotal}`.
     * @param onError   Callback on failure.
     */
    void awardPoints(
        const std::string &userId,
        std::int64_t amount,
        const std::string &reason,
        const std::string &source,
        Callback onSuccess,
        ErrCallback onError);

    // -------------------------------------------------------
    // Badges
    // -------------------------------------------------------

    /**
     * @brief Evaluate all badge rules for a user.
     *
     * Returns a list of *newly* earned badges (those that
     * were not previously held).
     *
     * @param userId   Target user ID.
     * @param onSuccess Callback with badge JSON array.
     * @param onError   Callback on failure.
     */
    void checkAndAwardBadges(
        const std::string &userId,
        Callback onSuccess,
        ErrCallback onError);

    // -------------------------------------------------------
    // Streaks
    // -------------------------------------------------------

    /**
     * @brief Record a daily activity and update the streak.
     *
     * Idempotent within a single calendar day.
     *
     * @param userId   Target user ID.
     * @param onSuccess Callback with StreakInfo JSON.
     * @param onError   Callback on failure.
     */
    void updateStreak(
        const std::string &userId,
        Callback onSuccess,
        ErrCallback onError);

    // -------------------------------------------------------
    // Leaderboard
    // -------------------------------------------------------

    /**
     * @brief Retrieve the top-N leaderboard.
     *
     * @param period  Time window: "all", "weekly",
     *                "monthly".
     * @param limit   Maximum entries to return.
     * @param onSuccess Callback with entry array.
     * @param onError   Callback on failure.
     */
    void getLeaderboard(
        const std::string &period,
        std::int32_t limit,
        Callback onSuccess,
        ErrCallback onError);

    // -------------------------------------------------------
    // Progress
    // -------------------------------------------------------

    /**
     * @brief Fetch a user's overall gamification progress.
     *
     * @param userId   Target user ID.
     * @param onSuccess Callback with progress JSON.
     * @param onError   Callback on failure.
     */
    void getUserProgress(
        const std::string &userId,
        Callback onSuccess,
        ErrCallback onError);

    // -------------------------------------------------------
    // Level calculation
    // -------------------------------------------------------

    /**
     * @brief Pure function: compute level from total points.
     *
     * @param points  Accumulated point total.
     * @return Level number (1-based).
     */
    [[nodiscard]] auto getLevelForPoints(
        std::int64_t points) const -> std::int32_t;

    /**
     * @brief Get the title string for a given level.
     *
     * @param level  Level number.
     * @return Human-readable title (e.g. "Expert").
     */
    [[nodiscard]] auto getLevelTitle(
        std::int32_t level) const -> std::string;

    /**
     * @brief Points needed to reach the next level.
     *
     * @param currentPoints  Current total.
     * @return Points remaining, or 0 if at max level.
     */
    [[nodiscard]] auto pointsToNextLevel(
        std::int64_t currentPoints) const
        -> std::int64_t;

private:
    /// Convenience accessor for the default DB client.
    [[nodiscard]] static auto db() -> DbClientPtr;

    /// Level thresholds loaded from gamification.json.
    json config_;

    /// Parsed level table for fast lookup.
    struct LevelDef {
        std::int32_t level;
        std::int64_t minPoints;
        std::string title;
    };
    std::vector<LevelDef> levels_;

    /// Streak milestones (e.g. 3, 7, 14 ...).
    std::vector<std::int32_t> milestones_;
};

}  // namespace services
