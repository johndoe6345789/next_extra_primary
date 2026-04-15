#pragma once
/**
 * @file UserBadgeService.h
 * @brief User badge retrieval operations.
 *
 * Queries earned badges for a given user by joining the
 * `user_badges` and `badges` tables.
 */

#include "users/backend/user_service_types.h"

#include <string>

namespace services
{

/**
 * @class UserBadgeService
 * @brief Retrieve badges earned by a user.
 */
class UserBadgeService
{
  public:
    UserBadgeService() = default;
    ~UserBadgeService() = default;

    /**
     * @brief Get all badges earned by a user.
     *
     * @param userId    User UUID.
     * @param onSuccess Callback with badge array JSON.
     * @param onError   Callback on failure.
     */
    void getUserBadges(const std::string& userId, Callback onSuccess,
                       ErrCallback onError);

  private:
    /// Convenience DB accessor.
    [[nodiscard]] static auto db() -> DbClientPtr;
};

} // namespace services
