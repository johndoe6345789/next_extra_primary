#pragma once
/**
 * @file NotificationDeleter.h
 * @brief Bulk-mark and delete operations for notifications.
 */

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>

#include <functional>
#include <string>

namespace services
{

using json = nlohmann::json;
using DbClientPtr = drogon::orm::DbClientPtr;
using Callback =
    std::function<void(json)>;
using ErrCallback =
    std::function<void(drogon::HttpStatusCode, std::string)>;

/**
 * @class NotificationDeleter
 * @brief Handles bulk-read-marking and deletion of notifications.
 */
class NotificationDeleter
{
  public:
    NotificationDeleter() = default;
    ~NotificationDeleter() = default;

    /**
     * @brief Mark all of a user's notifications as read.
     *
     * @param userId    Owner user ID.
     * @param onSuccess Callback with `{"count": N}`.
     * @param onError   Callback on failure.
     */
    void markAllAsRead(const std::string& userId,
                       Callback onSuccess,
                       ErrCallback onError);

    /**
     * @brief Delete a single notification.
     *
     * @param notificationId Notification UUID.
     * @param userId         Owner (for authorisation).
     * @param onSuccess      Callback with `{"deleted": true}`.
     * @param onError        Callback on failure.
     */
    void deleteNotification(
        const std::string& notificationId,
        const std::string& userId,
        Callback onSuccess,
        ErrCallback onError);

  private:
    /// Convenience accessor for the default DB client.
    [[nodiscard]] static auto db() -> DbClientPtr;
};

} // namespace services
