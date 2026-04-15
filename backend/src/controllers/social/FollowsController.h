#pragma once
/**
 * @file FollowsController.h
 * @brief HTTP routes for the follow graph (7.1).
 */

#include <drogon/HttpController.h>

namespace controllers::social
{

/**
 * @brief Follow / unfollow / list edges.
 *
 * All routes are JWT-gated; the actor id comes from the
 * filter-populated `user_id` attribute.
 */
class FollowsController
    : public drogon::HttpController<FollowsController>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(
        FollowsController::follow,
        "/api/social/follows/{user}", drogon::Post,
        "filters::JwtAuthFilter");
    ADD_METHOD_TO(
        FollowsController::unfollow,
        "/api/social/follows/{user}", drogon::Delete,
        "filters::JwtAuthFilter");
    ADD_METHOD_TO(
        FollowsController::listFollowing,
        "/api/social/follows/{user}/following",
        drogon::Get, "filters::JwtAuthFilter");
    ADD_METHOD_TO(
        FollowsController::listFollowers,
        "/api/social/follows/{user}/followers",
        drogon::Get, "filters::JwtAuthFilter");
    METHOD_LIST_END

    /** @brief Create an edge from caller -> user. */
    void follow(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        const std::string& user);

    /** @brief Remove the edge caller -> user. */
    void unfollow(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        const std::string& user);

    /** @brief Users that @p user follows. */
    void listFollowing(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        const std::string& user);

    /** @brief Users following @p user. */
    void listFollowers(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        const std::string& user);
};

} // namespace controllers::social
