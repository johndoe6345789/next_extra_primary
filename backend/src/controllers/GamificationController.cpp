/**
 * @file GamificationController.cpp
 * @brief Gamification endpoint implementations.
 */

#include "GamificationController.h"
#include "../utils/JsonResponse.h"

#include <nlohmann/json.hpp>
#include <string>

using json = nlohmann::json;
using Cb = std::function<void(const drogon::HttpResponsePtr&)>;

/// @brief Safely parse a string to long long, returning @p fallback on error.
static auto safeStoll(const std::string& s,
                      long long fallback) noexcept -> long long
{
    try {
        return std::stoll(s);
    } catch (...) {
        return fallback;
    }
}

namespace controllers
{

void GamificationController::listBadges(const drogon::HttpRequestPtr& /*req*/,
                                        Cb&& cb)
{
    // TODO: fetch from database.
    json badges = json::array({{{"id", "early_adopter"},
                                {"name", "Early Adopter"},
                                {"description", "Joined during beta"},
                                {"icon", "star"}},
                               {{"id", "first_chat"},
                                {"name", "First Chat"},
                                {"description", "Completed first AI chat"},
                                {"icon", "chat"}}});
    cb(::utils::jsonOk({{"badges", badges}}));
}

// ----------------------------------------------------------
void GamificationController::leaderboard(const drogon::HttpRequestPtr& req,
                                         Cb&& cb)
{
    auto period = req->getParameter("period");
    auto limitStr = req->getParameter("limit");
    int limit = static_cast<int>(safeStoll(limitStr, 10));
    if (period.empty()) {
        period = "weekly";
    }

    // TODO: query database for top users.
    json entries = json::array();
    cb(::utils::jsonOk(
        {{"period", period}, {"limit", limit}, {"leaderboard", entries}}));
}

// ----------------------------------------------------------
void GamificationController::myStreaks(const drogon::HttpRequestPtr& req,
                                       Cb&& cb)
{
    auto userId = req->attributes()->get<std::string>("user_id");
    // TODO: fetch streaks from database.
    json streaks = {{"user_id", userId},
                    {"current_streak", 0},
                    {"longest_streak", 0},
                    {"last_activity", nullptr}};
    cb(::utils::jsonOk(streaks));
}

// ----------------------------------------------------------
void GamificationController::awardPoints(const drogon::HttpRequestPtr& req,
                                         Cb&& cb)
{
    auto role = req->attributes()->get<std::string>("user_role");
    if (role != "admin") {
        cb(::utils::jsonError(drogon::k403Forbidden, "Admin access required"));
        return;
    }

    auto body = json::parse(
        req->bodyData(), req->bodyData() + req->bodyLength(), nullptr, false);
    if (body.is_discarded() || !body.contains("user_id") ||
        !body.contains("points")) {
        cb(::utils::jsonError(drogon::k400BadRequest,
                              "user_id and points required"));
        return;
    }

    // TODO: persist to database.
    cb(::utils::jsonOk({{"message", "Points awarded"},
                        {"user_id", body["user_id"]},
                        {"points", body["points"]}}));
}

// ----------------------------------------------------------
void GamificationController::myProgress(const drogon::HttpRequestPtr& req,
                                        Cb&& cb)
{
    auto userId = req->attributes()->get<std::string>("user_id");
    // TODO: aggregate progress from database.
    json progress = {{"user_id", userId},
                     {"level", 1},
                     {"total_points", 0},
                     {"next_level_at", 100},
                     {"badges_earned", 0}};
    cb(::utils::jsonOk(progress));
}

} // namespace controllers
