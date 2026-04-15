#pragma once
/**
 * @file FollowStore.h
 * @brief Persistence layer for the user follow graph (7.1).
 */

#include <nlohmann/json.hpp>
#include <string>

namespace services::social::follows
{

/**
 * @class FollowStore
 * @brief Synchronous CRUD over the follows table.
 *
 * All operations run against the default Drogon db client.
 * Graph edges are directed (follower -> followee); a user
 * may not follow themselves.
 */
class FollowStore
{
  public:
    /** @brief Create an edge; idempotent on conflict. */
    bool follow(const std::string& follower,
                const std::string& followee);

    /** @brief Remove an edge; returns rows affected. */
    int unfollow(const std::string& follower,
                 const std::string& followee);

    /** @brief Users followed by @p user. */
    nlohmann::json following(
        const std::string& user, int limit);

    /** @brief Users who follow @p user. */
    nlohmann::json followers(
        const std::string& user, int limit);

    /** @brief True if @p a follows @p b. */
    bool isFollowing(const std::string& a,
                     const std::string& b);
};

} // namespace services::social::follows
