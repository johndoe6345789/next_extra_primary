/**
 * @file DmControllerMessages.cpp
 * @brief Per-thread message list + send endpoints.
 */

#include "DmController.h"
#include "../../services/social/dm/DmStore.h"
#include "../../utils/JsonResponse.h"

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;
using namespace drogon;

namespace controllers::social
{

void DmController::listMessages(
    const HttpRequestPtr& req, Cb&& cb,
    const std::string& id)
{
    try {
        services::social::dm::DmStore s;
        auto tid = std::stoll(id);
        cb(::utils::jsonOk({
            {"messages", s.listMessages(tid, 100)},
        }));
    } catch (const std::exception& e) {
        spdlog::error(
            "dm.listMessages: {}", e.what());
        cb(::utils::jsonError(
            k500InternalServerError,
            "messages failed"));
    }
}

void DmController::sendMessage(
    const HttpRequestPtr& req, Cb&& cb,
    const std::string& id)
{
    try {
        auto body = nlohmann::json::parse(
            std::string{req->getBody()});
        const auto text =
            body.value("body", std::string{});
        if (text.empty()) {
            cb(::utils::jsonError(
                k400BadRequest,
                "body required"));
            return;
        }
        auto sender = req->attributes()->get<
            std::string>("user_id");
        services::social::dm::DmStore s;
        auto tid = std::stoll(id);
        auto mid = s.sendMessage(tid, sender, text);
        cb(::utils::jsonCreated({{"id", mid}}));
    } catch (const std::exception& e) {
        spdlog::error("dm.send: {}", e.what());
        cb(::utils::jsonError(
            k500InternalServerError, "send failed"));
    }
}

} // namespace controllers::social
