#pragma once
/**
 * @file PresenceController.h
 * @brief HTTP routes for presence (7.3).
 *
 * WebSocket-level heartbeats live in a future
 * dedicated WebSocket controller; for now we expose
 * a polling HTTP surface to avoid pulling extra infra.
 */

#include <drogon/HttpController.h>

namespace controllers::social
{

/**
 * @brief HTTP endpoints for presence heartbeat and
 *        bulk read.
 */
class PresenceController
    : public drogon::HttpController<PresenceController>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(
        PresenceController::heartbeat,
        "/api/social/presence/heartbeat",
        drogon::Post, "filters::JwtAuthFilter");
    ADD_METHOD_TO(
        PresenceController::status,
        "/api/social/presence/{user}",
        drogon::Get, "filters::JwtAuthFilter");
    ADD_METHOD_TO(
        PresenceController::bulk,
        "/api/social/presence",
        drogon::Post, "filters::JwtAuthFilter");
    METHOD_LIST_END

    /** @brief Refresh the caller's TTL in Redis. */
    void heartbeat(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb);

    /** @brief Read status for a single user. */
    void status(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        const std::string& user);

    /** @brief Read status for a user list. */
    void bulk(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb);
};

} // namespace controllers::social
