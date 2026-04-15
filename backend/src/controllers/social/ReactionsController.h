#pragma once
/**
 * @file ReactionsController.h
 * @brief HTTP routes for emoji reactions (7.4).
 */

#include <drogon/HttpController.h>

namespace controllers::social
{

/**
 * @brief Add / remove / list reactions by target.
 */
class ReactionsController
    : public drogon::HttpController<ReactionsController>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(
        ReactionsController::add,
        "/api/social/reactions", drogon::Post,
        "filters::JwtAuthFilter");
    ADD_METHOD_TO(
        ReactionsController::remove,
        "/api/social/reactions", drogon::Delete,
        "filters::JwtAuthFilter");
    ADD_METHOD_TO(
        ReactionsController::summary,
        "/api/social/reactions/summary",
        drogon::Get, "filters::JwtAuthFilter");
    METHOD_LIST_END

    /** @brief Add a reaction; idempotent. */
    void add(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb);

    /** @brief Remove a reaction. */
    void remove(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb);

    /** @brief Aggregated counts per emoji. */
    void summary(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb);
};

} // namespace controllers::social
