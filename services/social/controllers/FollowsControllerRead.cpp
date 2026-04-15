/**
 * @file FollowsControllerRead.cpp
 * @brief Follow graph list endpoints (7.1).
 */

#include "FollowsController.h"
#include "social/backend/follows/FollowStore.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <drogon/drogon.h>
#include <spdlog/spdlog.h>

using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;
using namespace drogon;

namespace controllers::social
{

void FollowsController::listFollowing(
    const HttpRequestPtr& req, Cb&& cb,
    const std::string& user)
{
    try {
        services::social::follows::FollowStore s;
        cb(::utils::jsonOk({
            {"items", s.following(user, 100)},
        }));
    } catch (const std::exception& e) {
        spdlog::error(
            "follows.following: {}", e.what());
        cb(::utils::jsonError(
            k500InternalServerError,
            "list failed"));
    }
}

void FollowsController::listFollowers(
    const HttpRequestPtr& req, Cb&& cb,
    const std::string& user)
{
    try {
        services::social::follows::FollowStore s;
        cb(::utils::jsonOk({
            {"items", s.followers(user, 100)},
        }));
    } catch (const std::exception& e) {
        spdlog::error(
            "follows.followers: {}", e.what());
        cb(::utils::jsonError(
            k500InternalServerError,
            "list failed"));
    }
}

} // namespace controllers::social
