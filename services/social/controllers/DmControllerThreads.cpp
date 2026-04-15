/**
 * @file DmControllerThreads.cpp
 * @brief Thread list + open endpoints for DMs (7.2).
 */

#include "DmController.h"
#include "social/backend/dm/DmStore.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;
using namespace drogon;

namespace controllers::social
{

static std::string caller(
    const HttpRequestPtr& req)
{
    return req->attributes()->get<
        std::string>("user_id");
}

void DmController::listThreads(
    const HttpRequestPtr& req, Cb&& cb)
{
    try {
        services::social::dm::DmStore s;
        cb(::utils::jsonOk({
            {"threads",
             s.listThreads(caller(req), 50)},
        }));
    } catch (const std::exception& e) {
        spdlog::error("dm.threads: {}", e.what());
        cb(::utils::jsonError(
            k500InternalServerError,
            "threads failed"));
    }
}

void DmController::openThread(
    const HttpRequestPtr& req, Cb&& cb)
{
    try {
        auto body = nlohmann::json::parse(
            std::string{req->getBody()});
        const auto peer =
            body.value("peer", std::string{});
        if (peer.empty()) {
            cb(::utils::jsonError(
                k400BadRequest, "peer required"));
            return;
        }
        services::social::dm::DmStore s;
        auto id = s.upsertThread(caller(req), peer);
        cb(::utils::jsonCreated({{"id", id}}));
    } catch (const std::exception& e) {
        spdlog::error("dm.open: {}", e.what());
        cb(::utils::jsonError(
            k500InternalServerError, "open failed"));
    }
}

} // namespace controllers::social
