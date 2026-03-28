/**
 * @file UserController.cpp
 * @brief User management endpoint implementations.
 */

#include "UserController.h"
#include "../utils/JsonResponse.h"

#include <nlohmann/json.hpp>
#include <string>

using json = nlohmann::json;
using Cb = std::function<void(const drogon::HttpResponsePtr&)>;

/// @brief Safely parse a string to long long, returning @p fallback on error.
static auto safeStoll(const std::string& s, long long fallback) noexcept
    -> long long
{
    try {
        return std::stoll(s);
    } catch (...) {
        return fallback;
    }
}

namespace controllers
{

void UserController::list(const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto role = req->attributes()->get<std::string>("user_role");
    if (role != "admin") {
        cb(::utils::jsonError(drogon::k403Forbidden, "Admin access required"));
        return;
    }

    auto pageStr = req->getParameter("page");
    auto perPageStr = req->getParameter("per_page");
    int64_t page = safeStoll(pageStr, 1);
    int64_t perPage = safeStoll(perPageStr, 20);

    // TODO: query database with LIMIT/OFFSET.
    json users = json::array();
    cb(::utils::jsonPaginated(users, 0, page, perPage));
}

// ----------------------------------------------------------
void UserController::getProfile(const drogon::HttpRequestPtr& /*req*/, Cb&& cb,
                                const std::string& id)
{
    // TODO: look up user by id in database.
    json user = {{"id", id},
                 {"username", "placeholder"},
                 {"display_name", "Placeholder User"},
                 {"created_at", "2025-01-01T00:00:00Z"}};
    cb(::utils::jsonOk(user));
}

// ----------------------------------------------------------
void UserController::updateProfile(const drogon::HttpRequestPtr& req, Cb&& cb,
                                   const std::string& id)
{
    auto callerId = req->attributes()->get<std::string>("user_id");
    if (callerId != id) {
        cb(::utils::jsonError(drogon::k403Forbidden,
                              "Can only update own profile"));
        return;
    }

    auto body = json::parse(
        req->bodyData(), req->bodyData() + req->bodyLength(), nullptr, false);
    if (body.is_discarded()) {
        cb(::utils::jsonError(drogon::k400BadRequest, "Invalid JSON body"));
        return;
    }

    // TODO: apply partial update to database.
    json updated = {{"id", id}, {"message", "Profile updated"}};
    cb(::utils::jsonOk(updated));
}

// ----------------------------------------------------------
void UserController::getBadges(const drogon::HttpRequestPtr& /*req*/, Cb&& cb,
                               const std::string& id)
{
    // TODO: fetch badges from database.
    json badges = json::array();
    cb(::utils::jsonOk({{"user_id", id}, {"badges", badges}}));
}

// ----------------------------------------------------------
void UserController::getStats(const drogon::HttpRequestPtr& /*req*/, Cb&& cb,
                              const std::string& id)
{
    // TODO: fetch gamification stats from database.
    json stats = {
        {"user_id", id}, {"total_points", 0}, {"level", 1}, {"streak_days", 0}};
    cb(::utils::jsonOk(stats));
}

} // namespace controllers
