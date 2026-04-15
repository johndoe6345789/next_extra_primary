/**
 * @file webhooks_controller_events.cpp
 * @brief GET /api/webhooks/events — static catalogue of event types.
 */

#include "WebhooksController.h"

#include <drogon/drogon.h>
#include <drogon/orm/DbClient.h>

namespace nextra::webhooks
{

using namespace drogon;

void WebhooksController::listEvents(
    const HttpRequestPtr&,
    std::function<void(const HttpResponsePtr&)>&& cb)
{
    auto db = app().getDbClient();
    auto rows = db->execSqlSync(
        "SELECT event_type, description FROM webhook_events"
        " ORDER BY event_type");
    Json::Value items(Json::arrayValue);
    for (const auto& r : rows)
    {
        Json::Value o;
        o["event_type"] = r["event_type"].as<std::string>();
        o["description"] = r["description"].isNull()
            ? std::string{} : r["description"].as<std::string>();
        items.append(o);
    }
    Json::Value body;
    body["items"] = items;
    cb(HttpResponse::newHttpJsonResponse(body));
}

}  // namespace nextra::webhooks
