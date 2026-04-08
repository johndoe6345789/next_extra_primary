/**
 * @file GamificationProgress.cpp
 * @brief Progress and streaks handlers for
 *        GamificationController.
 */

#include "GamificationController.h"
#include "../utils/JsonResponse.h"

#include <nlohmann/json.hpp>
#include <string>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;

namespace controllers
{

void GamificationController::myStreaks(
    const drogon::HttpRequestPtr& req,
    Cb&& cb)
{
    auto userId = req->attributes()
        ->get<std::string>("user_id");
    json streaks = {
        {"user_id", userId},
        {"current_streak", 0},
        {"longest_streak", 0},
        {"last_activity", nullptr}};
    cb(::utils::jsonOk(streaks));
}

void GamificationController::myProgress(
    const drogon::HttpRequestPtr& req,
    Cb&& cb)
{
    auto userId = req->attributes()
        ->get<std::string>("user_id");
    json progress = {
        {"user_id", userId},
        {"level", 1},
        {"total_points", 0},
        {"next_level_at", 100},
        {"badges_earned", 0}};
    cb(::utils::jsonOk(progress));
}

} // namespace controllers
