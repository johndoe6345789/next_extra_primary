#pragma once
/**
 * @file CommentsV2ModController.h
 * @brief Moderation endpoints for the
 *        polymorphic threaded comment system.
 */

#include <drogon/HttpController.h>

namespace controllers
{

class CommentsV2ModController
    : public drogon::HttpController<
          CommentsV2ModController>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(
        CommentsV2ModController::flagged,
        "/api/comments/v2/flagged",
        drogon::Get, "filters::JwtAuthFilter");
    ADD_METHOD_TO(
        CommentsV2ModController::hide,
        "/api/comments/v2/{id}/hide",
        drogon::Post, "filters::JwtAuthFilter");
    ADD_METHOD_TO(
        CommentsV2ModController::unhide,
        "/api/comments/v2/{id}/unhide",
        drogon::Post, "filters::JwtAuthFilter");
    ADD_METHOD_TO(
        CommentsV2ModController::clearFlags,
        "/api/comments/v2/{id}/clear-flags",
        drogon::Post, "filters::JwtAuthFilter");
    METHOD_LIST_END

    /** @brief List flagged comments. */
    void flagged(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb);

    /** @brief Hide (soft-delete) a comment. */
    void hide(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        const std::string& id);

    /** @brief Restore a hidden comment. */
    void unhide(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        const std::string& id);

    /** @brief Clear flags from a comment. */
    void clearFlags(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        const std::string& id);
};

} // namespace controllers
