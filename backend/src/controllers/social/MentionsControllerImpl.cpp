/**
 * @file MentionsControllerImpl.cpp
 * @brief Handlers for @mention parse + persist (7.5).
 */

#include "MentionsController.h"
#include "../../services/social/mentions/MentionParser.h"
#include "../../utils/JsonResponse.h"

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;
using namespace drogon;

namespace controllers::social
{

void MentionsController::parse(
    const HttpRequestPtr& req, Cb&& cb)
{
    try {
        auto body = nlohmann::json::parse(
            std::string{req->getBody()});
        const auto text =
            body.value("text", std::string{});
        services::social::mentions::MentionParser p;
        cb(::utils::jsonOk({
            {"handles", p.extract(text)},
        }));
    } catch (const std::exception& e) {
        spdlog::error(
            "mentions.parse: {}", e.what());
        cb(::utils::jsonError(
            k400BadRequest, "invalid payload"));
    }
}

void MentionsController::persist(
    const HttpRequestPtr& req, Cb&& cb)
{
    try {
        auto body = nlohmann::json::parse(
            std::string{req->getBody()});
        services::social::mentions::MentionParser p;
        int n = p.persist(
            body.at("source_type"),
            body.at("source_id"),
            body.at("text"));
        cb(::utils::jsonOk({{"inserted", n}}));
    } catch (const std::exception& e) {
        spdlog::error(
            "mentions.persist: {}", e.what());
        cb(::utils::jsonError(
            k400BadRequest, "invalid payload"));
    }
}

} // namespace controllers::social
