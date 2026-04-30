#pragma once
/**
 * @file ForumBoardController.h
 * @brief Forum board configuration REST endpoints.
 *
 * Routes:
 *   GET /api/forum/boards        — list all boards
 *   PUT /api/forum/boards/{slug} — update a board (admin)
 */

#include <drogon/HttpController.h>

namespace controllers
{

class ForumBoardController
    : public drogon::HttpController<ForumBoardController>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(
        ForumBoardController::list,
        "/api/forum/boards",
        drogon::Get);
    ADD_METHOD_TO(
        ForumBoardController::update,
        "/api/forum/boards/{slug}",
        drogon::Put,
        "filters::JwtAuthFilter");
    METHOD_LIST_END

    /** @brief Return all boards ordered by sort_order. */
    void list(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb);

    /**
     * @brief Update a board's settings (admin only).
     * @param slug The board slug to update.
     */
    void update(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        const std::string& slug);
};

} // namespace controllers
