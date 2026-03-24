#pragma once
/**
 * @file NotificationService.h
 * @brief In-app notification management service.
 *
 * Provides CRUD operations for user notifications plus
 * convenience helpers for common gamification events
 * (badge earned, level up, streak milestone).
 */

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>

#include <cstdint>
#include <functional>
#include <string>

namespace services {

using json = nlohmann::json;
using DbClientPtr = drogon::orm::DbClientPtr;
using Callback = std::function<void(json)>;
using ErrCallback =
    std::function<void(drogon::HttpStatusCode,
                       std::string)>;

/**
 * @class NotificationService
 * @brief Create, query, and manage in-app notifications.
 */
class NotificationService {
public:
    NotificationService() = default;
    ~NotificationService() = default;

    // -------------------------------------------------------
    // CRUD
    // -------------------------------------------------------

    /**
     * @brief Create a new notification.
     *
     * @param userId   Target user.
     * @param title    Short title text.
     * @param body     Longer body / description.
     * @param type     Category string (e.g. "badge",
     *                 "level_up", "streak", "system").
     * @param metadata Arbitrary JSON payload.
     * @param onSuccess Callback with the new notification.
     * @param onError   Callback on failure.
     */
    void createNotification(
        const std::string &userId,
        const std::string &title,
        const std::string &body,
        const std::string &type,
        const json &metadata,
        Callback onSuccess,
        ErrCallback onError);

    /**
     * @brief Fetch a paginated list of notifications.
     *
     * @param userId   Owner user ID.
     * @param page     1-based page number.
     * @param perPage  Items per page.
     * @param onSuccess Callback with paginated result.
     * @param onError   Callback on failure.
     */
    void getNotifications(
        const std::string &userId,
        std::int32_t page,
        std::int32_t perPage,
        Callback onSuccess,
        ErrCallback onError);

    /**
     * @brief Count unread notifications for a user.
     *
     * @param userId   Owner user ID.
     * @param onSuccess Callback with `{count: N}`.
     * @param onError   Callback on failure.
     */
    void getUnreadCount(
        const std::string &userId,
        Callback onSuccess,
        ErrCallback onError);

    /**
     * @brief Mark a single notification as read.
     *
     * @param notificationId Notification UUID.
     * @param userId         Owner (for authorisation).
     * @param onSuccess      Callback with `{read: true}`.
     * @param onError        Callback on failure.
     */
    void markAsRead(
        const std::string &notificationId,
        const std::string &userId,
        Callback onSuccess,
        ErrCallback onError);

    /**
     * @brief Mark all of a user's notifications as read.
     *
     * @param userId   Owner user ID.
     * @param onSuccess Callback with `{count: N}`.
     * @param onError   Callback on failure.
     */
    void markAllAsRead(
        const std::string &userId,
        Callback onSuccess,
        ErrCallback onError);

    /**
     * @brief Delete a notification.
     *
     * @param notificationId Notification UUID.
     * @param userId         Owner (for authorisation).
     * @param onSuccess      Callback with `{deleted: true}`.
     * @param onError        Callback on failure.
     */
    void deleteNotification(
        const std::string &notificationId,
        const std::string &userId,
        Callback onSuccess,
        ErrCallback onError);

    // -------------------------------------------------------
    // Convenience event helpers
    // -------------------------------------------------------

    /**
     * @brief Notify the user of a newly earned badge.
     *
     * @param userId Target user.
     * @param badge  Badge JSON with "name" and "slug".
     */
    void notifyBadgeEarned(
        const std::string &userId,
        const json &badge);

    /**
     * @brief Notify the user of a level-up event.
     *
     * @param userId   Target user.
     * @param newLevel The level just reached.
     */
    void notifyLevelUp(
        const std::string &userId,
        std::int32_t newLevel);

    /**
     * @brief Notify the user of a streak milestone.
     *
     * @param userId Target user.
     * @param days   Streak length in days.
     */
    void notifyStreakMilestone(
        const std::string &userId,
        std::int32_t days);

private:
    /// Convenience accessor for the default DB client.
    [[nodiscard]] static auto db() -> DbClientPtr;
};

}  // namespace services
