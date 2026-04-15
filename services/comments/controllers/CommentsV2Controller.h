#pragma once
/**
 * @file CommentsV2Controller.h
 * @brief Public REST endpoints for the
 *        polymorphic threaded comment system.
 *        Moderation routes live in
 *        CommentsV2ModController.
 */

#include <drogon/HttpController.h>

namespace controllers
{

class CommentsV2Controller
    : public drogon::HttpController<
          CommentsV2Controller>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(
        CommentsV2Controller::tree,
        "/api/comments/v2/tree", drogon::Get);
    ADD_METHOD_TO(
        CommentsV2Controller::create,
        "/api/comments/v2", drogon::Post,
        "filters::JwtAuthFilter");
    ADD_METHOD_TO(
        CommentsV2Controller::flag,
        "/api/comments/v2/{id}/flag",
        drogon::Post,
        "filters::JwtAuthFilter");
    METHOD_LIST_END

    /** @brief GET tree for a target. */
    void tree(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb);

    /** @brief POST a new comment. */
    void create(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb);

    /** @brief POST a flag on a comment. */
    void flag(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        const std::string& id);
};

} // namespace controllers
