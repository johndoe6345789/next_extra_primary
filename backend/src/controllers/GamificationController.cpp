/**
 * @file GamificationController.cpp
 * @brief Gamification endpoint implementations:
 *        badges, leaderboard, award points.
 *
 * Streaks and progress are in GamificationProgress.cpp.
 */

#include "GamificationController.h"
#include "../utils/JsonResponse.h"
#include "../utils/parse_helpers.h"
#include "gamification_handlers.h"

#include <nlohmann/json.hpp>
#include <string>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;

namespace controllers
{

void GamificationController::listBadges(
    const drogon::HttpRequestPtr& /*req*/,
    Cb&& cb)
{
    cb(::utils::jsonOk(
        {{"badges", buildBadgeList()}}));
}

void GamificationController::leaderboard(
    const drogon::HttpRequestPtr& req,
    Cb&& cb)
{
    auto period = req->getParameter("period");
    auto limitStr = req->getParameter("limit");
    int limit = static_cast<int>(
        ::utils::safeStoll(limitStr, 10));
    if (period.empty()) {
        period = "weekly";
    }

    json entries = json::array();
    cb(::utils::jsonOk(
        {{"period", period},
         {"limit", limit},
         {"leaderboard", entries}}));
}

void GamificationController::awardPoints(
    const drogon::HttpRequestPtr& req,
    Cb&& cb)
{
    auto body = parseAwardBody(req);
    if (!body.has_value()) {
        auto role = req->attributes()
            ->get<std::string>("user_role");
        if (role != "admin") {
            cb(::utils::jsonError(
                drogon::k403Forbidden,
                "Admin access required"));
        } else {
            cb(::utils::jsonError(
                drogon::k400BadRequest,
                "user_id and points required"));
        }
        return;
    }

    cb(::utils::jsonOk(
        {{"message", "Points awarded"},
         {"user_id", (*body)["user_id"]},
         {"points", (*body)["points"]}}));
}

} // namespace controllers
