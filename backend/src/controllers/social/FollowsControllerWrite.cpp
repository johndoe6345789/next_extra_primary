/**
 * @file FollowsControllerWrite.cpp
 * @brief Follow / unfollow mutation endpoints (7.1).
 */

#include "FollowsController.h"
#include "../../services/social/follows/FollowStore.h"
#include "../../utils/JsonResponse.h"

#include <drogon/drogon.h>
#include <spdlog/spdlog.h>

using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;
using namespace drogon;

namespace controllers::social
{

static std::string actorId(
    const HttpRequestPtr& req)
{
    auto id = req->attributes()->get<
        std::string>("user_id");
    return id;
}

void FollowsController::follow(
    const HttpRequestPtr& req, Cb&& cb,
    const std::string& user)
{
    try {
        services::social::follows::FollowStore s;
        s.follow(actorId(req), user);
        cb(::utils::jsonOk({{"ok", true}}));
    } catch (const std::exception& e) {
        spdlog::error("follows.follow: {}", e.what());
        cb(::utils::jsonError(
            k500InternalServerError, "follow failed"));
    }
}

void FollowsController::unfollow(
    const HttpRequestPtr& req, Cb&& cb,
    const std::string& user)
{
    try {
        services::social::follows::FollowStore s;
        auto n = s.unfollow(actorId(req), user);
        cb(::utils::jsonOk({{"removed", n}}));
    } catch (const std::exception& e) {
        spdlog::error(
            "follows.unfollow: {}", e.what());
        cb(::utils::jsonError(
            k500InternalServerError,
            "unfollow failed"));
    }
}

} // namespace controllers::social
