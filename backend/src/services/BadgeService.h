#pragma once
/**
 * @file BadgeService.h
 * @brief Badge evaluation and awarding logic.
 *
 * Checks earned-badge criteria against live user
 * stats and inserts any newly qualified badges into
 * `badges` / `user_badges`.
 */

#include "services/gamification_types.h"

#include <string>

namespace services
{

/**
 * @class BadgeService
 * @brief Evaluates badge rules and persists awards.
 */
class BadgeService
{
  public:
    BadgeService()  = default;
    ~BadgeService() = default;

    /**
     * @brief Evaluate all badge rules for a user.
     *
     * Queries user stats, compares against badge
     * thresholds, and inserts newly earned badges.
     * Returns only the *newly* awarded badges.
     *
     * @param userId    Target user ID.
     * @param onSuccess Callback with badge JSON array.
     * @param onError   Callback on failure.
     */
    void checkAndAwardBadges(
        const std::string& userId,
        Callback           onSuccess,
        ErrCallback        onError);

  private:
    /// Convenience accessor for the default DB client.
    [[nodiscard]] static auto db() -> DbClientPtr;
};

} // namespace services
