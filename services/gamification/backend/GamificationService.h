#pragma once
/**
 * @file GamificationService.h
 * @brief Facade over gamification sub-services.
 *
 * Composes XpService, BadgeService, StreakService,
 * LeaderboardService, ProgressService, and
 * LevelService into a single entry point.
 */

#include "badges/backend/BadgeService.h"
#include "gamification/backend/gamification_facade_types.h"
#include "gamification/backend/gamification_types.h"
#include "leaderboards/backend/LeaderboardService.h"
#include "levels/backend/LevelService.h"
#include "progress/backend/ProgressService.h"
#include "streaks/backend/StreakService.h"
#include "xp/backend/XpService.h"

#include <cstdint>
#include <string>

namespace services
{

/**
 * @class GamificationService
 * @brief Thin facade over all gamification modules.
 */
class GamificationService
{
  public:
    GamificationService();
    ~GamificationService() = default;

    /** @brief Award points to a user. */
    void awardPoints(
        const std::string& userId,
        std::int64_t amount,
        const std::string& reason,
        const std::string& source,
        Callback onSuccess,
        ErrCallback onError);

    /** @brief Evaluate badge rules for a user. */
    void checkAndAwardBadges(
        const std::string& userId,
        Callback onSuccess,
        ErrCallback onError);

    /** @brief Record activity; update streak. */
    void updateStreak(
        const std::string& userId,
        Callback onSuccess,
        ErrCallback onError);

    /** @brief Retrieve top-N leaderboard. */
    void getLeaderboard(
        const std::string& period,
        std::int32_t limit,
        Callback onSuccess,
        ErrCallback onError);

    /** @brief Fetch user gamification progress. */
    void getUserProgress(
        const std::string& userId,
        Callback onSuccess,
        ErrCallback onError);

  private:
    json config_;
    LevelService levels_;
    XpService xp_;
    BadgeService badges_;
    StreakService streak_;
    LeaderboardService leaderboard_;
    ProgressService progress_;
};

} // namespace services
