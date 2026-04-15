#pragma once
/**
 * @file NotificationsController.h
 * @brief REST endpoints exposed by the notification-router daemon.
 *
 * The controller surface is deliberately split across three
 * implementation files (templates, prefs, queue) because each
 * concern would overflow the 100-LOC file cap on its own.  All
 * handlers live on one class so Drogon's METHOD_LIST_BEGIN block
 * stays in a single place and the operator tool talks to one
 * consistent `/api/notifications/*` base.
 */

#include <drogon/HttpController.h>

namespace controllers
{

class NotificationsController
    : public drogon::HttpController<
          NotificationsController>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(
        NotificationsController::listQueue,
        "/api/notifications/queue", drogon::Get);
    ADD_METHOD_TO(
        NotificationsController::retryOne,
        "/api/notifications/queue/{id}/retry",
        drogon::Post);
    ADD_METHOD_TO(
        NotificationsController::listTemplates,
        "/api/notifications/templates", drogon::Get);
    ADD_METHOD_TO(
        NotificationsController::upsertTemplate,
        "/api/notifications/templates", drogon::Post);
    ADD_METHOD_TO(
        NotificationsController::listPrefs,
        "/api/notifications/prefs/{user}", drogon::Get);
    ADD_METHOD_TO(
        NotificationsController::setPref,
        "/api/notifications/prefs/{user}", drogon::Post);
    METHOD_LIST_END

    void listQueue(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb);
    void retryOne(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        const std::string& id);
    void listTemplates(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb);
    void upsertTemplate(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb);
    void listPrefs(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        const std::string& user);
    void setPref(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        const std::string& user);
};

}  // namespace controllers
