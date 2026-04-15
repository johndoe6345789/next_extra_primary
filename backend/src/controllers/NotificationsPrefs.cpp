/**
 * @file NotificationsPrefs.cpp
 * @brief /api/notifications/prefs — per-user channel opt-in.
 */

#include "controllers/NotificationsController.h"

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>

using drogon::HttpResponse;
using drogon::HttpStatusCode;

namespace controllers
{

void NotificationsController::listPrefs(
    const drogon::HttpRequestPtr&,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb,
    const std::string& user)
{
    auto db = drogon::app().getDbClient();
    auto rows = db->execSqlSync(
        "SELECT channel, enabled "
        "FROM notification_prefs "
        "WHERE user_id=$1::uuid",
        user);
    nlohmann::json items = nlohmann::json::array();
    for (auto r : rows)
        items.push_back({
            {"channel", r["channel"].as<std::string>()},
            {"enabled", r["enabled"].as<bool>()},
        });
    nlohmann::json out = {{"items", items}};
    auto resp = HttpResponse::newHttpResponse();
    resp->setContentTypeCode(drogon::CT_APPLICATION_JSON);
    resp->setBody(out.dump());
    cb(resp);
}

void NotificationsController::setPref(
    const drogon::HttpRequestPtr& req,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb,
    const std::string& user)
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
        "INSERT INTO notification_prefs "
        "  (user_id, channel, enabled) "
        "VALUES ($1::uuid,$2,$3) "
        "ON CONFLICT (user_id, channel) "
        "DO UPDATE SET enabled=EXCLUDED.enabled",
        user,
        body.value("channel", std::string{}),
        body.value("enabled", true));
    auto resp = HttpResponse::newHttpResponse();
    resp->setStatusCode(HttpStatusCode::k204NoContent);
    cb(resp);
}

}  // namespace controllers
