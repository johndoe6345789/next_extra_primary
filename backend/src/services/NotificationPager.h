#pragma once
/**
 * @file NotificationPager.h
 * @brief Paginated notification listing for a user.
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
using Callback = std::function<void(json)>;
using ErrCallback = std::function<void(drogon::HttpStatusCode, std::string)>;

/**
 * @class NotificationPager
 * @brief Fetches paginated notification lists from the database.
 */
class NotificationPager
{
  public:
    NotificationPager() = default;
    ~NotificationPager() = default;

    /**
     * @brief Fetch a paginated list of notifications for a user.
     *
     * @param userId    Owner user ID.
     * @param page      1-based page number (clamped to >= 1).
     * @param perPage   Items per page (clamped to 1-100).
     * @param onSuccess Callback with paginated result.
     * @param onError   Callback on failure.
     */
    void getNotifications(const std::string& userId, std::int32_t page,
                          std::int32_t perPage, Callback onSuccess,
                          ErrCallback onError);

  private:
    /// Convenience accessor for the default DB client.
    [[nodiscard]] static auto db() -> DbClientPtr;
};

} // namespace services
