#pragma once
/**
 * @file AdminEmailController.h
 * @brief Admin endpoint for sending test emails.
 *
 * Allows admins to verify SMTP configuration by
 * sending a test message to any address.
 */

#include <drogon/HttpController.h>

namespace controllers
{

class AdminEmailController
    : public drogon::HttpController<
          AdminEmailController>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(
        AdminEmailController::sendTest,
        "/api/admin/email/test",
        drogon::Post,
        "filters::JwtAuthFilter");
    METHOD_LIST_END

    /**
     * @brief Send a test email via SMTP.
     * @param req JSON body: to, subject, body.
     * @param cb  Response callback.
     */
    void sendTest(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&
        )>&& cb);
};

} // namespace controllers
