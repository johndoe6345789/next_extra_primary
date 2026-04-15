#pragma once
/**
 * @file BadgeInserter.h
 * @brief Upserts a single badge and links it to a user.
 *
 * Used internally by BadgeService to persist each
 * candidate badge and decrement a shared counter so
 * the caller can fire onSuccess when all inserts are
 * done.
 */

#include "gamification/backend/gamification_types.h"

#include <cstddef>
#include <memory>
#include <string>

namespace services
{

/**
 * @class BadgeInserter
 * @brief Performs the two-step badge upsert for one
 *        badge candidate.
 *
 * Inserts into `badges` (ON CONFLICT DO UPDATE) then
 * into `user_badges` (ON CONFLICT DO NOTHING) and
 * calls onSuccess once all candidates are resolved.
 */
class BadgeInserter
{
  public:
    BadgeInserter() = default;
    ~BadgeInserter() = default;

    /**
     * @brief Upsert one badge for a user.
     *
     * @param userId    Target user ID.
     * @param badge     Badge JSON with slug/name/desc.
     * @param remaining Shared counter; fires onSuccess
     *                  when it reaches zero.
     * @param result    Shared accumulator of new badges.
     * @param onSuccess Fired when all inserts complete.
     */
    void insertOne(const std::string& userId, const json& badge,
                   std::shared_ptr<std::size_t> remaining,
                   std::shared_ptr<json> result, Callback onSuccess);

  private:
    [[nodiscard]] static auto db() -> DbClientPtr;
};

} // namespace services
