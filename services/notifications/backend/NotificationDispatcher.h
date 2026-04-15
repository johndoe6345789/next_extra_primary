#pragma once
/**
 * @file NotificationDispatcher.h
 * @brief Fire-and-forget gamification event notifications.
 */

#include "notifications/backend/NotificationMutator.h"

#include <nlohmann/json.hpp>

#include <cstdint>
#include <string>

namespace services
{

/**
 * @class NotificationDispatcher
 * @brief Convenience wrappers that fire notifications for common
 *        gamification events (badge, level-up, streak).
 *
 * All methods are fire-and-forget: errors are logged but not
 * propagated to the caller.
 */
class NotificationDispatcher
{
  public:
    NotificationDispatcher() = default;
    ~NotificationDispatcher() = default;

    /**
     * @brief Notify a user that they earned a badge.
     *
     * @param userId Target user ID.
     * @param badge  Badge JSON with at least a "name" field.
     */
    void notifyBadgeEarned(const std::string& userId, const json& badge);

    /**
     * @brief Notify a user of a level-up event.
     *
     * @param userId    Target user ID.
     * @param newLevel  The level just reached.
     */
    void notifyLevelUp(const std::string& userId, std::int32_t newLevel);

    /**
     * @brief Notify a user of a streak milestone.
     *
     * @param userId Target user ID.
     * @param days   Streak length in days.
     */
    void notifyStreakMilestone(const std::string& userId, std::int32_t days);

  private:
    NotificationMutator mutator_;
};

} // namespace services
