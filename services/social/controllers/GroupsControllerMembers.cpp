/**
 * @file GroupsControllerMembers.cpp
 * @brief Group membership endpoints (7.6).
 */

#include "GroupsController.h"
#include "social/backend/groups/GroupStore.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;
using namespace drogon;

namespace controllers::social
{

void GroupsController::addMember(
    const HttpRequestPtr& req, Cb&& cb,
    const std::string& id)
{
    try {
        auto body = nlohmann::json::parse(
            std::string{req->getBody()});
        services::social::groups::GroupStore s;
        s.addMember(
            std::stoll(id),
            body.at("user_id"),
            body.value("role",
                       std::string{"member"}));
        cb(::utils::jsonOk({{"ok", true}}));
    } catch (const std::exception& e) {
        spdlog::error(
            "groups.addMember: {}", e.what());
        cb(::utils::jsonError(
            k400BadRequest, "invalid payload"));
    }
}

void GroupsController::removeMember(
    const HttpRequestPtr& req, Cb&& cb,
    const std::string& id, const std::string& user)
{
    try {
        services::social::groups::GroupStore s;
        auto n = s.removeMember(
            std::stoll(id), user);
        cb(::utils::jsonOk({{"removed", n}}));
    } catch (const std::exception& e) {
        spdlog::error(
            "groups.removeMember: {}", e.what());
        cb(::utils::jsonError(
            k500InternalServerError,
            "remove failed"));
    }
}

void GroupsController::listMembers(
    const HttpRequestPtr& req, Cb&& cb,
    const std::string& id)
{
    try {
        services::social::groups::GroupStore s;
        cb(::utils::jsonOk({
            {"members",
             s.listMembers(std::stoll(id), 500)},
        }));
    } catch (const std::exception& e) {
        spdlog::error(
            "groups.listMembers: {}", e.what());
        cb(::utils::jsonError(
            k500InternalServerError,
            "members failed"));
    }
}

} // namespace controllers::social
