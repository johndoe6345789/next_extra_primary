/**
 * @file AnalyticsControllerEvents.cpp
 * @brief POST /api/analytics/events handler.
 *        Accepts {name, props?} and inserts into
 *        analytics_events. No admin role required.
 */

#include "AnalyticsController.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;
using namespace drogon;
using namespace drogon::orm;

namespace controllers
{

void AnalyticsController::trackEvent(
    const HttpRequestPtr& req, Cb&& cb)
{
    json body;
    try {
        body = json::parse(
            std::string{req->getBody()});
    } catch (...) {
        cb(::utils::jsonError(
            k400BadRequest, "invalid JSON"));
        return;
    }

    if (!body.contains("name") ||
        !body["name"].is_string()) {
        cb(::utils::jsonError(
            k400BadRequest,
            "name is required"));
        return;
    }

    const auto name =
        body["name"].get<std::string>();
    const auto props =
        body.value("props", json::object())
            .dump();
    const auto userId =
        req->getAttributes()->get<std::string>(
            "user_id");
    const auto ip =
        std::string{req->getPeerAddr().toIp()};
    const auto ua =
        std::string{req->getHeader("User-Agent")};

    auto db = app().getDbClient();
    // Use NULLIF to store NULL for anonymous users.
    const std::string sql =
        "INSERT INTO analytics_events "
        "  (user_id, name, props, ip, user_agent) "
        "VALUES (NULLIF($1,''), $2, $3::jsonb, "
        "        $4, $5)";

    *db << sql << userId << name
        << props << ip << ua
        >> [cb](const Result&) {
            cb(::utils::jsonOk({{"ok", true}}));
        }
        >> [cb](const DrogonDbException& e) {
            spdlog::error(
                "analytics.trackEvent: {}",
                e.base().what());
            cb(::utils::jsonError(
                k500InternalServerError,
                "internal error"));
        };
}

} // namespace controllers
