#pragma once
/**
 * @file CommentsController.h
 * @brief REST endpoints for user comments /
 *        activity feed.
 */

#include <drogon/HttpController.h>

namespace controllers
{

class CommentsController
    : public drogon::HttpController<
          CommentsController>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(
        CommentsController::list,
        "/api/comments", drogon::Get);
    ADD_METHOD_TO(
        CommentsController::create,
        "/api/comments", drogon::Post,
        "filters::JwtAuthFilter");
    ADD_METHOD_TO(
        CommentsController::remove,
        "/api/comments/{id}", drogon::Delete,
        "filters::JwtAuthFilter");
    METHOD_LIST_END

    /**
     * @brief List comments (public).
     * Query params: limit, offset.
     */
    void list(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&&
            cb);

    /**
     * @brief Create a comment (auth required).
     * Body: { "content": "..." }
     */
    void create(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&&
            cb);

    /**
     * @brief Delete own comment (auth required).
     * @param id Comment UUID from path.
     */
    void remove(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&&
            cb,
        const std::string& id);
};

} // namespace controllers
