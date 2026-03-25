#pragma once
/**
 * @file NotificationService.h
 * @brief Facade for in-app notification management.
 *
 * Aggregates NotificationMutator, NotificationDeleter,
 * NotificationPager, NotificationQuery, and
 * NotificationDispatcher into a single entry point.
 */

#include "services/NotificationDeleter.h"
#include "services/NotificationDispatcher.h"
#include "services/NotificationMutator.h"
#include "services/NotificationPager.h"
#include "services/NotificationQuery.h"

namespace services
{

/**
 * @class NotificationService
 * @brief Thin facade delegating to notification sub-modules.
 */
class NotificationService
{
  public:
    NotificationService() = default;
    ~NotificationService() = default;

    /** @brief Create a new notification.
     *  @see NotificationMutator::createNotification */
    void createNotification(const std::string& userId,
                            const std::string& title,
                            const std::string& body,
                            const std::string& type,
                            const json& metadata,
                            Callback onSuccess,
                            ErrCallback onError);

    /** @brief Fetch a paginated notification list.
     *  @see NotificationPager::getNotifications */
    void getNotifications(const std::string& userId,
                          std::int32_t page,
                          std::int32_t perPage,
                          Callback onSuccess,
                          ErrCallback onError);

    /** @brief Count unread notifications for a user.
     *  @see NotificationQuery::getUnreadCount */
    void getUnreadCount(const std::string& userId,
                        Callback onSuccess,
                        ErrCallback onError);

    /** @brief Mark a single notification as read.
     *  @see NotificationMutator::markAsRead */
    void markAsRead(const std::string& notificationId,
                    const std::string& userId,
                    Callback onSuccess,
                    ErrCallback onError);

    /** @brief Mark all of a user's notifications as read.
     *  @see NotificationDeleter::markAllAsRead */
    void markAllAsRead(const std::string& userId,
                       Callback onSuccess,
                       ErrCallback onError);

    /** @brief Delete a notification.
     *  @see NotificationDeleter::deleteNotification */
    void deleteNotification(
        const std::string& notificationId,
        const std::string& userId,
        Callback onSuccess,
        ErrCallback onError);

    /** @brief Notify the user of a newly earned badge.
     *  @see NotificationDispatcher::notifyBadgeEarned */
    void notifyBadgeEarned(const std::string& userId,
                           const json& badge);

    /** @brief Notify the user of a level-up event.
     *  @see NotificationDispatcher::notifyLevelUp */
    void notifyLevelUp(const std::string& userId,
                       std::int32_t newLevel);

    /** @brief Notify the user of a streak milestone.
     *  @see NotificationDispatcher::notifyStreakMilestone */
    void notifyStreakMilestone(const std::string& userId,
                               std::int32_t days);

  private:
    NotificationMutator    mutator_;
    NotificationDeleter    deleter_;
    NotificationPager      pager_;
    NotificationQuery      query_;
    NotificationDispatcher dispatcher_;
};

} // namespace services
