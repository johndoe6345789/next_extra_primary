#pragma once
/**
 * @file MentionsController.h
 * @brief HTTP routes for @mention parsing (7.5).
 */

#include <drogon/HttpController.h>

namespace controllers::social
{

/**
 * @brief Parse text for mentions and optionally persist.
 */
class MentionsController
    : public drogon::HttpController<MentionsController>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(
        MentionsController::parse,
        "/api/social/mentions/parse",
        drogon::Post, "filters::JwtAuthFilter");
    ADD_METHOD_TO(
        MentionsController::persist,
        "/api/social/mentions",
        drogon::Post, "filters::JwtAuthFilter");
    METHOD_LIST_END

    /** @brief Extract handles without writing. */
    void parse(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb);

    /** @brief Parse and insert mention rows. */
    void persist(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb);
};

} // namespace controllers::social
