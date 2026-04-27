#pragma once
/**
 * @file ForumController.h
 * @brief Forum thread/post REST endpoints.
 *
 * Routes:
 *   GET  /api/forum/threads          — list threads
 *   GET  /api/forum/threads/{id}     — thread + posts
 *   POST /api/forum/threads          — create thread
 *   POST /api/forum/threads/{id}/posts — add post
 *   POST /api/forum/posts/{id}/reactions — react
 *
 * Forum data lives in comments_v2:
 *   Threads: target_type='forum_board'
 *   Posts:   target_type='forum_thread'
 */

#include <drogon/HttpController.h>

namespace controllers
{

class ForumController
    : public drogon::HttpController<ForumController>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(
        ForumController::list,
        "/api/forum/threads",
        drogon::Get);
    ADD_METHOD_TO(
        ForumController::detail,
        "/api/forum/threads/{id}",
        drogon::Get);
    ADD_METHOD_TO(
        ForumController::create,
        "/api/forum/threads",
        drogon::Post, "filters::JwtAuthFilter");
    ADD_METHOD_TO(
        ForumController::createPost,
        "/api/forum/threads/{id}/posts",
        drogon::Post, "filters::JwtAuthFilter");
    ADD_METHOD_TO(
        ForumController::addReaction,
        "/api/forum/posts/{id}/reactions",
        drogon::Post, "filters::JwtAuthFilter");
    METHOD_LIST_END

    /** @brief Paginated thread list. */
    void list(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb);

    /** @brief Thread with its posts. */
    void detail(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        const std::string& id);

    /** @brief Create a new thread. */
    void create(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb);

    /** @brief Add a post to a thread. */
    void createPost(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        const std::string& id);

    /** @brief Add a reaction to a post. */
    void addReaction(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        const std::string& id);
};

} // namespace controllers
