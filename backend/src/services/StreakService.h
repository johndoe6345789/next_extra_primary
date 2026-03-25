#pragma once
/**
 * @file StreakService.h
 * @brief Daily activity streak tracking.
 *
 * Records a user's daily activity and updates the
 * current and longest streak counters.  Reports
 * whether a streak milestone was reached.
 */

#include "services/gamification_types.h"

#include <cstdint>
#include <string>
#include <vector>

namespace services
{

/**
 * @class StreakService
 * @brief Maintains user daily-activity streaks.
 */
class StreakService
{
  public:
    /**
     * @brief Construct with milestone list.
     *
     * @param milestones Sorted list of streak values
     *                   that trigger milestone rewards.
     */
    explicit StreakService(std::vector<std::int32_t> milestones);

    ~StreakService() = default;

    /**
     * @brief Record today's activity and update streak.
     *
     * Idempotent within a single calendar day.
     *
     * @param userId    Target user ID.
     * @param onSuccess Callback with StreakInfo JSON.
     * @param onError   Callback on failure.
     */
    void updateStreak(const std::string& userId, Callback onSuccess,
                      ErrCallback onError);

  private:
    [[nodiscard]] static auto db() -> DbClientPtr;

    std::vector<std::int32_t> milestones_;
};

} // namespace services
