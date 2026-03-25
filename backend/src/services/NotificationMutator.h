#pragma once
/**
 * @file NotificationMutator.h
 * @brief Create and mark-as-read operations for notifications.
 */

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>

#include <cstdint>
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
 * @class NotificationMutator
 * @brief Creates notifications and marks individual ones as read.
 */
class NotificationMutator
{
  public:
    NotificationMutator() = default;
    ~NotificationMutator() = default;

    /**
     * @brief Create a new notification record.
     *
     * @param userId    Target user ID.
     * @param title     Short title text.
     * @param body      Longer body / description.
     * @param type      Category string.
     * @param metadata  Arbitrary JSON payload.
     * @param onSuccess Callback with the new notification JSON.
     * @param onError   Callback on failure.
     */
    void createNotification(const std::string& userId,
                            const std::string& title,
                            const std::string& body,
                            const std::string& type,
                            const json& metadata,
                            Callback onSuccess,
                            ErrCallback onError);

    /**
     * @brief Mark a single notification as read.
     *
     * @param notificationId Notification UUID.
     * @param userId         Owner (for authorisation).
     * @param onSuccess      Callback with `{"read": true}`.
     * @param onError        Callback on failure.
     */
    void markAsRead(const std::string& notificationId,
                    const std::string& userId,
                    Callback onSuccess,
                    ErrCallback onError);

  private:
    /// Convenience accessor for the default DB client.
    [[nodiscard]] static auto db() -> DbClientPtr;
};

} // namespace services
