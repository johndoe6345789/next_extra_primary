#pragma once
/**
 * @file EmailAccountController.h
 * @brief CRUD endpoints for email accounts.
 */

#include <drogon/HttpController.h>

namespace controllers
{

class EmailAccountController
    : public drogon::HttpController<
          EmailAccountController>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(
        EmailAccountController::list,
        "/api/email/accounts",
        drogon::Get,
        "filters::CookieAuthFilter");
    ADD_METHOD_TO(
        EmailAccountController::create,
        "/api/email/accounts",
        drogon::Post,
        "filters::CookieAuthFilter");
    METHOD_LIST_END

    /**
     * @brief List accounts for current user.
     * @param req Request with JWT user.
     * @param cb  Response callback.
     */
    void list(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&
        )>&& cb);

    /**
     * @brief Create a new email account.
     * @param req JSON body with IMAP config.
     * @param cb  Response callback.
     */
    void create(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&
        )>&& cb);
};

} // namespace controllers
