#pragma once
/**
 * @file LeaderboardService.h
 * @brief Leaderboard query logic.
 *
 * Builds ranked lists of users ordered by points
 * for all-time, weekly, and monthly periods.
 */

#include "services/gamification_types.h"
#include "services/LevelService.h"

#include <cstdint>
#include <string>

namespace services
{

/**
 * @class LeaderboardService
 * @brief Fetches ranked leaderboard data.
 */
class LeaderboardService
{
  public:
    /**
     * @brief Construct with a LevelService pointer.
     *
     * @param levels Non-owning pointer to a
     *               LevelService; must outlive this.
     */
    explicit LeaderboardService(const LevelService* levels);

    ~LeaderboardService() = default;

    /**
     * @brief Retrieve the top-N leaderboard.
     *
     * @param period    Time window: "all", "weekly",
     *                  or "monthly".
     * @param limit     Maximum entries to return.
     * @param onSuccess Callback with entry array.
     * @param onError   Callback on failure.
     */
    void getLeaderboard(const std::string& period, std::int32_t limit,
                        Callback onSuccess, ErrCallback onError);

  private:
    [[nodiscard]] static auto db() -> DbClientPtr;

    const LevelService* levels_{nullptr};
};

} // namespace services
