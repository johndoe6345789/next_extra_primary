/**
 * @file GroupsControllerCrud.cpp
 * @brief Group list + create endpoints (7.6).
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

void GroupsController::list(
    const HttpRequestPtr& req, Cb&& cb)
{
    try {
        services::social::groups::GroupStore s;
        cb(::utils::jsonOk({
            {"groups", s.listAll(200)},
        }));
    } catch (const std::exception& e) {
        spdlog::error("groups.list: {}", e.what());
        cb(::utils::jsonError(
            k500InternalServerError,
            "list failed"));
    }
}

void GroupsController::create(
    const HttpRequestPtr& req, Cb&& cb)
{
    try {
        auto body = nlohmann::json::parse(
            std::string{req->getBody()});
        services::social::groups::GroupStore s;
        auto id = s.create(
            body.at("slug"),
            body.at("name"),
            body.value("description",
                       std::string{}));
        cb(::utils::jsonCreated({{"id", id}}));
    } catch (const std::exception& e) {
        spdlog::error("groups.create: {}", e.what());
        cb(::utils::jsonError(
            k400BadRequest, "invalid payload"));
    }
}

} // namespace controllers::social
