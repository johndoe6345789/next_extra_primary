/**
 * @file NotificationService.cpp
 * @brief Facade implementation for in-app notifications.
 */

#include "services/NotificationService.h"

namespace services
{

void NotificationService::createNotification(
    const std::string& userId, const std::string& title,
    const std::string& body, const std::string& type,
    const json& metadata,
    Callback onSuccess, ErrCallback onError)
{
    mutator_.createNotification(
        userId, title, body, type, metadata,
        std::move(onSuccess), std::move(onError));
}

void NotificationService::getNotifications(
    const std::string& userId,
    std::int32_t page, std::int32_t perPage,
    Callback onSuccess, ErrCallback onError)
{
    pager_.getNotifications(
        userId, page, perPage,
        std::move(onSuccess), std::move(onError));
}

void NotificationService::getUnreadCount(
    const std::string& userId,
    Callback onSuccess, ErrCallback onError)
{
    query_.getUnreadCount(
        userId,
        std::move(onSuccess), std::move(onError));
}

void NotificationService::markAsRead(
    const std::string& notificationId,
    const std::string& userId,
    Callback onSuccess, ErrCallback onError)
{
    mutator_.markAsRead(
        notificationId, userId,
        std::move(onSuccess), std::move(onError));
}

void NotificationService::markAllAsRead(
    const std::string& userId,
    Callback onSuccess, ErrCallback onError)
{
    deleter_.markAllAsRead(
        userId,
        std::move(onSuccess), std::move(onError));
}

void NotificationService::deleteNotification(
    const std::string& notificationId,
    const std::string& userId,
    Callback onSuccess, ErrCallback onError)
{
    deleter_.deleteNotification(
        notificationId, userId,
        std::move(onSuccess), std::move(onError));
}

void NotificationService::notifyBadgeEarned(
    const std::string& userId, const json& badge)
{
    dispatcher_.notifyBadgeEarned(userId, badge);
}

void NotificationService::notifyLevelUp(
    const std::string& userId, std::int32_t newLevel)
{
    dispatcher_.notifyLevelUp(userId, newLevel);
}

void NotificationService::notifyStreakMilestone(
    const std::string& userId, std::int32_t days)
{
    dispatcher_.notifyStreakMilestone(userId, days);
}

} // namespace services
