/**
 * @file NotificationsTemplates.cpp
 * @brief /api/notifications/templates — CRUD for the editable
 *        template library surfaced by the operator tool.
 */

#include "notifications/controllers/NotificationsController.h"

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>

using drogon::HttpResponse;
using drogon::HttpStatusCode;

namespace controllers
{

void NotificationsController::listTemplates(
    const drogon::HttpRequestPtr&,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb)
{
    auto db = drogon::app().getDbClient();
    auto rows = db->execSqlSync(
        "SELECT key, channel, subject, body, updated_at "
        "FROM notification_templates "
        "ORDER BY key");
    nlohmann::json items = nlohmann::json::array();
    for (auto r : rows)
    {
        items.push_back({
            {"key", r["key"].as<std::string>()},
            {"channel", r["channel"].as<std::string>()},
            {"subject", r["subject"].as<std::string>()},
            {"body", r["body"].as<std::string>()},
            {"updated_at",
             r["updated_at"].as<std::string>()},
        });
    }
    nlohmann::json out = {{"items", items}};
    auto resp = HttpResponse::newHttpResponse();
    resp->setContentTypeCode(drogon::CT_APPLICATION_JSON);
    resp->setBody(out.dump());
    cb(resp);
}

void NotificationsController::upsertTemplate(
    const drogon::HttpRequestPtr& req,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb)
{
    auto body = nlohmann::json::parse(
        std::string{req->getBody()}, nullptr, false);
    if (body.is_discarded() || !body.is_object())
    {
        auto bad = HttpResponse::newHttpResponse();
        bad->setStatusCode(HttpStatusCode::k400BadRequest);
        cb(bad);
        return;
    }
    auto db = drogon::app().getDbClient();
    db->execSqlSync(
        "INSERT INTO notification_templates "
        "  (key, channel, subject, body, updated_at) "
        "VALUES ($1,$2,$3,$4,now()) "
        "ON CONFLICT (key) DO UPDATE SET "
        "  channel=EXCLUDED.channel, "
        "  subject=EXCLUDED.subject, "
        "  body=EXCLUDED.body, "
        "  updated_at=now()",
        body.value("key", std::string{}),
        body.value("channel", std::string{}),
        body.value("subject", std::string{}),
        body.value("body", std::string{}));
    auto resp = HttpResponse::newHttpResponse();
    resp->setStatusCode(HttpStatusCode::k204NoContent);
    cb(resp);
}

}  // namespace controllers
