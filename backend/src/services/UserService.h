#pragma once
/**
 * @file UserService.h
 * @brief User profile CRUD and statistics service.
 *
 * Provides lookups, updates, and aggregated statistics for
 * user accounts.  Badges and gamification data are surfaced
 * through dedicated accessors.
 */

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>

#include <cstdint>
#include <functional>
#include <optional>
#include <string>

namespace services
{

using json = nlohmann::json;
using DbClientPtr = drogon::orm::DbClientPtr;
using Callback = std::function<void(json)>;
using ErrCallback = std::function<void(drogon::HttpStatusCode, std::string)>;

/**
 * @brief Aggregate statistics for a single user.
 */
struct UserStats {
    std::int64_t totalPoints{0};
    std::int32_t level{1};
    std::int32_t currentStreak{0};
    std::int32_t longestStreak{0};
    std::int64_t badgeCount{0};
    std::int64_t messageCount{0};
};

/**
 * @class UserService
 * @brief User profile operations.
 */
class UserService
{
  public:
    UserService() = default;
    ~UserService() = default;

    // -------------------------------------------------------
    // Single-user lookups
    // -------------------------------------------------------

    /**
     * @brief Fetch a user by primary key.
     *
     * @param id        User UUID.
     * @param onSuccess Callback with user JSON or `null`.
     * @param onError   Callback on DB error.
     */
    void getUserById(const std::string& id, Callback onSuccess,
                     ErrCallback onError);

    /**
     * @brief Fetch a user by email address.
     *
     * @param email     Registered email.
     * @param onSuccess Callback with user JSON or `null`.
     * @param onError   Callback on DB error.
     */
    void getUserByEmail(const std::string& email, Callback onSuccess,
                        ErrCallback onError);

    // -------------------------------------------------------
    // Update
    // -------------------------------------------------------

    /**
     * @brief Update editable user fields.
     *
     * Supported keys in @p fields:
     * `display_name`, `username`, `avatar_url`, `bio`.
     *
     * @param id        User UUID.
     * @param fields    JSON object of key/value pairs.
     * @param onSuccess Callback with updated user JSON.
     * @param onError   Callback on failure.
     */
    void updateUser(const std::string& id, const json& fields,
                    Callback onSuccess, ErrCallback onError);

    // -------------------------------------------------------
    // Listing
    // -------------------------------------------------------

    /**
     * @brief Paginated list of all users.
     *
     * @param page      1-based page number.
     * @param perPage   Items per page (max 100).
     * @param onSuccess Callback with paginated result.
     * @param onError   Callback on failure.
     */
    void listUsers(std::int32_t page, std::int32_t perPage, Callback onSuccess,
                   ErrCallback onError);

    // -------------------------------------------------------
    // Badges
    // -------------------------------------------------------

    /**
     * @brief Get all badges earned by a user.
     *
     * @param userId    User UUID.
     * @param onSuccess Callback with badge array.
     * @param onError   Callback on failure.
     */
    void getUserBadges(const std::string& userId, Callback onSuccess,
                       ErrCallback onError);

    // -------------------------------------------------------
    // Stats
    // -------------------------------------------------------

    /**
     * @brief Get aggregated statistics for a user.
     *
     * @param userId    User UUID.
     * @param onSuccess Callback with UserStats JSON.
     * @param onError   Callback on failure.
     */
    void getUserStats(const std::string& userId, Callback onSuccess,
                      ErrCallback onError);

  private:
    /// Convenience DB accessor.
    [[nodiscard]] static auto db() -> DbClientPtr;

    /// Map a result row to a public-facing user JSON
    /// (excludes sensitive fields like password_hash).
    [[nodiscard]] static auto rowToJson(const drogon::orm::Row& row) -> json;

    /// Whitelist of columns that may be updated.
    static inline const std::vector<std::string> kEditableFields = {
        "display_name", "username", "avatar_url", "bio"};
};

} // namespace services
