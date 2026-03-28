/**
 * @file AuthTokenController.cpp
 * @brief Token management: logout, refresh, and me.
 */

#include "AuthTokenController.h"
#include "../services/AuthService.h"
#include "../utils/JsonResponse.h"
#include "../utils/JwtUtil.h"

#include <nlohmann/json.hpp>
#include <string>

using json = nlohmann::json;
using Cb = std::function<void(const drogon::HttpResponsePtr&)>;

namespace controllers
{

/** @brief Invalidate the caller's access token. */
void AuthTokenController::logout(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto authHeader = req->getHeader("Authorization");
    if (authHeader.size() <= 7) {
        cb(::utils::jsonError(drogon::k400BadRequest,
                              "Missing or malformed token"));
        return;
    }
    auto token = authHeader.substr(7);

    services::AuthService auth;
    auth.logoutUser(
        token,
        [cb](const services::json&) {
            cb(::utils::jsonOk(
                {{"message", "Logged out"}}));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

// ----------------------------------------------------------
void AuthTokenController::refresh(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto body = json::parse(
        req->bodyData(),
        req->bodyData() + req->bodyLength(),
        nullptr, false);
    if (body.is_discarded() ||
        !body.contains("refresh_token")) {
        cb(::utils::jsonError(drogon::k400BadRequest,
                              "refresh_token required"));
        return;
    }

    try {
        auto claims = ::utils::verifyToken(
            body["refresh_token"].get<std::string>());
        if (!claims.isRefresh) {
            cb(::utils::jsonError(drogon::k401Unauthorized,
                                  "Not a refresh token"));
            return;
        }
        auto access = ::utils::generateAccessToken(
            claims.userId, claims.role);
        cb(::utils::jsonOk({{"access_token", access}}));
    } catch (const std::exception& ex) {
        cb(::utils::jsonError(drogon::k401Unauthorized,
                              ex.what()));
    }
}

// ----------------------------------------------------------
void AuthTokenController::me(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto userId =
        req->attributes()->get<std::string>("user_id");
    // TODO: fetch full user from DB.
    json user = {
        {"id", userId},
        {"email", "user@example.com"},
        {"role",
         req->attributes()->get<std::string>("user_role")}};
    cb(::utils::jsonOk(user));
}

} // namespace controllers
