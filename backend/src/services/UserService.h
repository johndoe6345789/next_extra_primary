#pragma once
/**
 * @file UserService.h
 * @brief Facade combining all user-domain sub-services.
 *
 * Delegates to UserLookupService, UserProfileService,
 * UserSearchService, UserBadgeService, and UserStatsService.
 * Callers that depended on UserService are unaffected.
 */

#include "services/UserBadgeService.h"
#include "services/UserLookupService.h"
#include "services/UserProfileService.h"
#include "services/UserSearchService.h"
#include "services/UserStatsService.h"
#include "services/user_service_types.h"

#include <cstdint>
#include <string>

namespace services
{

/**
 * @class UserService
 * @brief Facade over all user-domain operations.
 */
class UserService
{
  public:
    UserService() = default;
    ~UserService() = default;

    /** @brief Fetch a user by primary key. */
    void getUserById(const std::string& id,
                     Callback onSuccess,
                     ErrCallback onError);

    /** @brief Fetch a user by email address. */
    void getUserByEmail(const std::string& email,
                        Callback onSuccess,
                        ErrCallback onError);

    /** @brief Update editable user profile fields. */
    void updateUser(const std::string& id,
                    const json& fields,
                    Callback onSuccess,
                    ErrCallback onError);

    /** @brief Paginated list of all users. */
    void listUsers(std::int32_t page, std::int32_t perPage,
                   Callback onSuccess, ErrCallback onError);

    /** @brief Get all badges earned by a user. */
    void getUserBadges(const std::string& userId,
                       Callback onSuccess,
                       ErrCallback onError);

    /** @brief Get aggregated statistics for a user. */
    void getUserStats(const std::string& userId,
                      Callback onSuccess,
                      ErrCallback onError);

  private:
    UserLookupService  lookup_;
    UserProfileService profile_;
    UserSearchService  search_;
    UserBadgeService   badges_;
    UserStatsService   stats_;
};

} // namespace services
