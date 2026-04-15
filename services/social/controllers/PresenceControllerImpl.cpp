/**
 * @file PresenceControllerImpl.cpp
 * @brief Presence heartbeat / status handlers (7.3).
 */

#include "PresenceController.h"
#include "social/backend/presence/PresenceTracker.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;
using namespace drogon;

namespace controllers::social
{

void PresenceController::heartbeat(
    const HttpRequestPtr& req, Cb&& cb)
{
    try {
        auto body = nlohmann::json::parse(
            std::string{req->getBody()},
            nullptr, false);
        std::string status = "online";
        if (!body.is_discarded())
            status = body.value(
                "status", std::string{"online"});
        auto uid = req->attributes()->get<
            std::string>("user_id");
        services::social::presence::PresenceTracker p;
        p.heartbeat(uid, status);
        cb(::utils::jsonOk({{"ok", true}}));
    } catch (const std::exception& e) {
        spdlog::error(
            "presence.heartbeat: {}", e.what());
        cb(::utils::jsonError(
            k500InternalServerError,
            "heartbeat failed"));
    }
}

void PresenceController::status(
    const HttpRequestPtr& req, Cb&& cb,
    const std::string& user)
{
    services::social::presence::PresenceTracker p;
    cb(::utils::jsonOk({
        {"user_id", user},
        {"status",  p.status(user)},
    }));
}

void PresenceController::bulk(
    const HttpRequestPtr& req, Cb&& cb)
{
    try {
        auto body = nlohmann::json::parse(
            std::string{req->getBody()});
        std::vector<std::string> users =
            body.value("users",
                       std::vector<std::string>{});
        services::social::presence::PresenceTracker p;
        cb(::utils::jsonOk({
            {"statuses", p.bulk(users)},
        }));
    } catch (const std::exception& e) {
        spdlog::error(
            "presence.bulk: {}", e.what());
        cb(::utils::jsonError(
            k500InternalServerError,
            "bulk failed"));
    }
}

} // namespace controllers::social
