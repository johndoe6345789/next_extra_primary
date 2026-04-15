#pragma once
/**
 * @file NotificationQuery.h
 * @brief Unread-count query for notifications.
 */

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>

#include <functional>
#include <string>

namespace services
{

using json = nlohmann::json;
using DbClientPtr = drogon::orm::DbClientPtr;
using Callback = std::function<void(json)>;
using ErrCallback = std::function<void(drogon::HttpStatusCode, std::string)>;

/**
 * @class NotificationQuery
 * @brief Counts unread notifications for a user.
 */
class NotificationQuery
{
  public:
    NotificationQuery() = default;
    ~NotificationQuery() = default;

    /**
     * @brief Count unread notifications for a user.
     *
     * @param userId    Owner user ID.
     * @param onSuccess Callback with `{"count": N}`.
     * @param onError   Callback on failure.
     */
    void getUnreadCount(const std::string& userId, Callback onSuccess,
                        ErrCallback onError);

  private:
    /// Convenience accessor for the default DB client.
    [[nodiscard]] static auto db() -> DbClientPtr;
};

} // namespace services
