#pragma once
/**
 * @file XpService.h
 * @brief Awards experience points to users.
 *
 * Inserts a `point_transactions` row and increments
 * the aggregate total stored on the `users` table.
 */

#include "gamification/backend/gamification_types.h"

#include <cstdint>
#include <string>

namespace services
{

/**
 * @class XpService
 * @brief Handles point-awarding operations.
 */
class XpService
{
  public:
    XpService() = default;
    ~XpService() = default;

    /**
     * @brief Award points to a user.
     *
     * Inserts into `point_transactions` and updates
     * `users.total_points` atomically.
     *
     * @param userId    Target user ID.
     * @param amount    Points to add (must be > 0).
     * @param reason    Human-readable description.
     * @param source    Machine key (e.g. "login").
     * @param onSuccess Callback with `{newTotal}`.
     * @param onError   Callback on failure.
     */
    void awardPoints(const std::string& userId, std::int64_t amount,
                     const std::string& reason, const std::string& source,
                     Callback onSuccess, ErrCallback onError);

  private:
    /// Convenience accessor for the default DB client.
    [[nodiscard]] static auto db() -> DbClientPtr;
};

} // namespace services
