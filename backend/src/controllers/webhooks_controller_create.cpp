/**
 * @file webhooks_controller_create.cpp
 * @brief POST /api/webhooks/endpoints — register a new endpoint.
 */

#include "WebhooksController.h"
#include "webhooks_controller_helpers.h"

#include <drogon/drogon.h>
#include <drogon/orm/DbClient.h>

namespace nextra::webhooks
{

using namespace drogon;

void WebhooksController::createEndpoint(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb)
{
    auto j = req->getJsonObject();
    if (!j) { cb(webhooksBadReq("body required")); return; }
    const auto url = (*j)["url"].asString();
    const auto secret = (*j)["secret"].asString();
    if (url.empty() || secret.empty())
    {
        cb(webhooksBadReq("url and secret required"));
        return;
    }
    auto db = app().getDbClient();
    auto rows = db->execSqlSync(
        "INSERT INTO webhook_endpoints"
        " (url, secret, events, active)"
        " VALUES ($1,$2,$3,$4) RETURNING id",
        url, secret,
        webhooksEventsArray(j->get("events", Json::arrayValue)),
        j->get("active", true).asBool());
    Json::Value body;
    body["id"] = static_cast<Json::Int64>(
        rows[0]["id"].as<std::int64_t>());
    auto r = HttpResponse::newHttpJsonResponse(body);
    r->setStatusCode(k201Created);
    cb(r);
}

}  // namespace nextra::webhooks
