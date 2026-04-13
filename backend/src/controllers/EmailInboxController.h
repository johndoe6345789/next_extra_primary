#pragma once
/**
 * @file EmailInboxController.h
 * @brief REST endpoints for email inbox.
 *
 * Provides message listing, detail retrieval,
 * and IMAP sync trigger.
 */

#include <drogon/HttpController.h>

namespace controllers
{

class EmailInboxController
    : public drogon::HttpController<
          EmailInboxController>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(
        EmailInboxController::listMessages,
        "/api/email/messages",
        drogon::Get,
        "filters::CookieAuthFilter");
    ADD_METHOD_TO(
        EmailInboxController::getMessage,
        "/api/email/messages/{id}",
        drogon::Get,
        "filters::CookieAuthFilter");
    ADD_METHOD_TO(
        EmailInboxController::syncAccount,
        "/api/email/sync/{accountId}",
        drogon::Post,
        "filters::CookieAuthFilter");
    METHOD_LIST_END

    /**
     * @brief List messages for an account.
     * @param req Query: accountId, folder, page.
     * @param cb  Response callback.
     */
    void listMessages(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&
        )>&& cb);

    /**
     * @brief Get a single message.
     * @param req  Request.
     * @param cb   Response callback.
     * @param id   Message UUID.
     */
    void getMessage(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&
        )>&& cb,
        const std::string& id);

    /**
     * @brief Trigger IMAP sync for an account.
     * @param req       Request.
     * @param cb        Response callback.
     * @param accountId Account UUID.
     */
    void syncAccount(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&
        )>&& cb,
        const std::string& accountId);
};

} // namespace controllers
