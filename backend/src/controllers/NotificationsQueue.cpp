/**
 * @file NotificationsQueue.cpp
 * @brief /api/notifications/queue endpoints — read the delivery
 *        ledger and flip failed rows back to pending for retry.
 */

#include "controllers/NotificationsController.h"

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>

using drogon::HttpResponse;
using drogon::HttpStatusCode;

namespace controllers
{

void NotificationsController::listQueue(
    const drogon::HttpRequestPtr&,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb)
{
    auto db = drogon::app().getDbClient();
    auto rows = db->execSqlSync(
        "SELECT id, user_id, channel, template, status, "
        "       attempts, sent_at, error, created_at "
        "FROM notifications "
        "ORDER BY created_at DESC LIMIT 200");
    nlohmann::json items = nlohmann::json::array();
    for (auto r : rows)
    {
        items.push_back({
            {"id", r["id"].as<std::int64_t>()},
            {"user_id", r["user_id"].as<std::string>()},
            {"channel", r["channel"].as<std::string>()},
            {"template", r["template"].as<std::string>()},
            {"status", r["status"].as<std::string>()},
            {"attempts", r["attempts"].as<int>()},
            {"sent_at",
             r["sent_at"].isNull()
                 ? std::string{}
                 : r["sent_at"].as<std::string>()},
            {"error",
             r["error"].isNull()
                 ? std::string{}
                 : r["error"].as<std::string>()},
            {"created_at",
             r["created_at"].as<std::string>()},
        });
    }
    nlohmann::json out = {{"items", items}};
    auto resp = HttpResponse::newHttpResponse();
    resp->setContentTypeCode(drogon::CT_APPLICATION_JSON);
    resp->setBody(out.dump());
    cb(resp);
}

void NotificationsController::retryOne(
    const drogon::HttpRequestPtr&,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb,
    const std::string& id)
{
    auto db = drogon::app().getDbClient();
    db->execSqlSync(
        "UPDATE notifications "
        "SET status='pending', error=NULL "
        "WHERE id=$1::bigint",
        id);
    auto resp = HttpResponse::newHttpResponse();
    resp->setStatusCode(HttpStatusCode::k204NoContent);
    cb(resp);
}

}  // namespace controllers
