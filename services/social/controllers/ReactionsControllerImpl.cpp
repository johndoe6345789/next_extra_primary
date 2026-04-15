/**
 * @file ReactionsControllerImpl.cpp
 * @brief Reaction handlers (7.4).
 */

#include "ReactionsController.h"
#include "social/backend/reactions/ReactionStore.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;
using namespace drogon;

namespace controllers::social
{

void ReactionsController::add(
    const HttpRequestPtr& req, Cb&& cb)
{
    try {
        auto body = nlohmann::json::parse(
            std::string{req->getBody()});
        auto uid = req->attributes()->get<
            std::string>("user_id");
        services::social::reactions::ReactionStore s;
        s.add(body.at("target_type"),
              body.at("target_id"),
              uid, body.at("emoji"));
        cb(::utils::jsonOk({{"ok", true}}));
    } catch (const std::exception& e) {
        spdlog::error("reactions.add: {}", e.what());
        cb(::utils::jsonError(
            k400BadRequest, "invalid payload"));
    }
}

void ReactionsController::remove(
    const HttpRequestPtr& req, Cb&& cb)
{
    try {
        auto body = nlohmann::json::parse(
            std::string{req->getBody()});
        auto uid = req->attributes()->get<
            std::string>("user_id");
        services::social::reactions::ReactionStore s;
        auto n = s.remove(
            body.at("target_type"),
            body.at("target_id"),
            uid, body.at("emoji"));
        cb(::utils::jsonOk({{"removed", n}}));
    } catch (const std::exception& e) {
        spdlog::error(
            "reactions.remove: {}", e.what());
        cb(::utils::jsonError(
            k400BadRequest, "invalid payload"));
    }
}

void ReactionsController::summary(
    const HttpRequestPtr& req, Cb&& cb)
{
    const auto t = req->getParameter("target_type");
    const auto i = req->getParameter("target_id");
    services::social::reactions::ReactionStore s;
    cb(::utils::jsonOk({
        {"summary", s.summary(t, i)},
    }));
}

} // namespace controllers::social
