#pragma once
/**
 * @file GamificationService.h
 * @brief Facade over gamification sub-services.
 *
 * Composes XpService, BadgeService, StreakService,
 * LeaderboardService, ProgressService, and
 * LevelService into a single entry point.
 */

#include "services/BadgeService.h"
#include "services/LeaderboardService.h"
#include "services/LevelService.h"
#include "services/ProgressService.h"
#include "services/StreakService.h"
#include "services/XpService.h"
#include "services/gamification_types.h"

#include <cstdint>
#include <string>

namespace services
{

/**
 * @class GamificationService
 * @brief Thin facade over all gamification modules.
 *
 * Loads `constants/gamification.json` once and
 * constructs each sub-service.
 */
class GamificationService
{
  public:
    GamificationService();
    ~GamificationService() = default;
    /**
     * @brief Award points to a user.
     * @param userId    Target user ID.
     * @param amount    Points to add (must be > 0).
     * @param reason    Human-readable description.
     * @param source    Machine key (e.g. "login").
     * @param onSuccess Callback with `{newTotal}`.
     * @param onError   Callback on failure.
     */
    void awardPoints(const std::string& userId,
        std::int64_t amount,
        const std::string& reason,
        const std::string& source,
        Callback onSuccess, ErrCallback onError);
    /**
     * @brief Evaluate all badge rules for a user.
     * @param userId    Target user ID.
     * @param onSuccess Callback with badge array.
     * @param onError   Callback on failure.
     */
    void checkAndAwardBadges(
        const std::string& userId,
        Callback onSuccess, ErrCallback onError);
    /**
     * @brief Record today's activity; update streak.
     * @param userId    Target user ID.
     * @param onSuccess Callback with StreakInfo JSON.
     * @param onError   Callback on failure.
     */
    void updateStreak(const std::string& userId,
        Callback onSuccess, ErrCallback onError);

    /**
     * @brief Retrieve the top-N leaderboard.
     * @param period    "all", "weekly", "monthly".
     * @param limit     Max entries to return.
     * @param onSuccess Callback with entry array.
     * @param onError   Callback on failure.
     */
    void getLeaderboard(const std::string& period,
        std::int32_t limit,
        Callback onSuccess, ErrCallback onError);

    /**
     * @brief Fetch a user's gamification progress.
     * @param userId    Target user ID.
     * @param onSuccess Callback with progress JSON.
     * @param onError   Callback on failure.
     */
    void getUserProgress(const std::string& userId,
        Callback onSuccess, ErrCallback onError);

  private:
    json               config_;
    LevelService       levels_;
    XpService          xp_;
    BadgeService       badges_;
    StreakService      streak_;
    LeaderboardService leaderboard_;
    ProgressService    progress_;
};

} // namespace services
