#pragma once
/**
 * @file DmController.h
 * @brief HTTP routes for direct messages (7.2).
 */

#include <drogon/HttpController.h>

namespace controllers::social
{

/**
 * @brief Thread + message endpoints for DMs.
 */
class DmController
    : public drogon::HttpController<DmController>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(
        DmController::listThreads,
        "/api/social/dm/threads", drogon::Get,
        "filters::JwtAuthFilter");
    ADD_METHOD_TO(
        DmController::openThread,
        "/api/social/dm/threads", drogon::Post,
        "filters::JwtAuthFilter");
    ADD_METHOD_TO(
        DmController::listMessages,
        "/api/social/dm/threads/{id}/messages",
        drogon::Get, "filters::JwtAuthFilter");
    ADD_METHOD_TO(
        DmController::sendMessage,
        "/api/social/dm/threads/{id}/messages",
        drogon::Post, "filters::JwtAuthFilter");
    METHOD_LIST_END

    /** @brief List threads for the caller. */
    void listThreads(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb);

    /** @brief Open or upsert a thread with a peer. */
    void openThread(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb);

    /** @brief Read messages for a thread. */
    void listMessages(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        const std::string& id);

    /** @brief Append a message to a thread. */
    void sendMessage(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        const std::string& id);
};

} // namespace controllers::social
