/**
 * @file webhooks_controller_endpoints.cpp
 * @brief List / update / delete endpoints for
 *        /api/webhooks/endpoints.
 *
 * Create lives in webhooks_controller_create.cpp so both files
 * can stay under the 100-line cap.
 */

#include "WebhooksController.h"
#include "webhooks_controller_helpers.h"

#include <drogon/drogon.h>
#include <drogon/orm/DbClient.h>

namespace nextra::webhooks
{

using namespace drogon;

void WebhooksController::listEndpoints(
    const HttpRequestPtr&,
    std::function<void(const HttpResponsePtr&)>&& cb)
{
    auto db = app().getDbClient();
    auto rows = db->execSqlSync(
        "SELECT id, url, events, active, failure_streak, created_at"
        "  FROM webhook_endpoints ORDER BY id DESC");
    Json::Value items(Json::arrayValue);
    for (const auto& r : rows)
    {
        Json::Value o;
        o["id"] = static_cast<Json::Int64>(
            r["id"].as<std::int64_t>());
        o["url"] = r["url"].as<std::string>();
        o["events"] = r["events"].as<std::string>();
        o["active"] = r["active"].as<bool>();
        o["failure_streak"] = r["failure_streak"].as<int>();
        o["created_at"] = r["created_at"].as<std::string>();
        items.append(o);
    }
    Json::Value body;
    body["items"] = items;
    cb(HttpResponse::newHttpJsonResponse(body));
}

void WebhooksController::updateEndpoint(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb, std::int64_t id)
{
    auto j = req->getJsonObject();
    if (!j) { cb(webhooksBadReq("body required")); return; }
    auto db = app().getDbClient();
    db->execSqlSync(
        "UPDATE webhook_endpoints SET active = $2, events = $3"
        " WHERE id = $1",
        id, j->get("active", true).asBool(),
        webhooksEventsArray(j->get("events", Json::arrayValue)));
    cb(HttpResponse::newHttpResponse());
}

void WebhooksController::deleteEndpoint(
    const HttpRequestPtr&,
    std::function<void(const HttpResponsePtr&)>&& cb, std::int64_t id)
{
    auto db = app().getDbClient();
    db->execSqlSync(
        "DELETE FROM webhook_endpoints WHERE id = $1", id);
    cb(HttpResponse::newHttpResponse());
}

}  // namespace nextra::webhooks
