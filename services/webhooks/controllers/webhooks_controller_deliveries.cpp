/**
 * @file webhooks_controller_deliveries.cpp
 * @brief List + replay endpoints for /api/webhooks/deliveries.
 */

#include "WebhooksController.h"
#include "webhooks_controller_helpers.h"

#include <drogon/drogon.h>
#include <drogon/orm/DbClient.h>

namespace nextra::webhooks
{

using namespace drogon;

void WebhooksController::listDeliveries(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb)
{
    const auto status = req->getParameter("status");
    auto db = app().getDbClient();
    auto rows = status.empty()
        ? db->execSqlSync(
              "SELECT id, endpoint_id, event_type, status, attempts,"
              " next_retry_at, last_status_code, last_error,"
              " delivered_at, created_at FROM webhook_deliveries"
              " ORDER BY id DESC LIMIT 200")
        : db->execSqlSync(
              "SELECT id, endpoint_id, event_type, status, attempts,"
              " next_retry_at, last_status_code, last_error,"
              " delivered_at, created_at FROM webhook_deliveries"
              " WHERE status = $1 ORDER BY id DESC LIMIT 200",
              status);
    Json::Value items(Json::arrayValue);
    for (const auto& r : rows)
    {
        Json::Value o;
        o["id"] = static_cast<Json::Int64>(
            r["id"].as<std::int64_t>());
        o["endpoint_id"] = static_cast<Json::Int64>(
            r["endpoint_id"].as<std::int64_t>());
        o["event_type"] = r["event_type"].as<std::string>();
        o["status"] = r["status"].as<std::string>();
        o["attempts"] = r["attempts"].as<int>();
        o["next_retry_at"] = r["next_retry_at"].isNull()
            ? std::string{} : r["next_retry_at"].as<std::string>();
        o["last_status_code"] = r["last_status_code"].isNull()
            ? 0 : r["last_status_code"].as<int>();
        o["last_error"] = r["last_error"].isNull()
            ? std::string{} : r["last_error"].as<std::string>();
        o["delivered_at"] = r["delivered_at"].isNull()
            ? std::string{} : r["delivered_at"].as<std::string>();
        o["created_at"] = r["created_at"].as<std::string>();
        items.append(o);
    }
    Json::Value body;
    body["items"] = items;
    cb(HttpResponse::newHttpJsonResponse(body));
}

void WebhooksController::replayDelivery(
    const HttpRequestPtr&,
    std::function<void(const HttpResponsePtr&)>&& cb, std::int64_t id)
{
    auto db = app().getDbClient();
    db->execSqlSync(
        "UPDATE webhook_deliveries SET status = 'pending',"
        " attempts = 0, next_retry_at = now(), last_error = NULL,"
        " last_status_code = NULL, delivered_at = NULL"
        " WHERE id = $1",
        id);
    cb(HttpResponse::newHttpResponse());
}

}  // namespace nextra::webhooks
