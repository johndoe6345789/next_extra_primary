/**
 * @file AuthTokenController.cpp
 * @brief Token management: logout and refresh.
 *
 * The "me" endpoint is in AuthTokenMe.cpp.
 */

#include "AuthTokenController.h"
#include "../services/AuthService.h"
#include "../utils/JsonResponse.h"
#include "auth_token_refresh.h"

#include <nlohmann/json.hpp>
#include <string>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;

namespace controllers
{

void AuthTokenController::logout(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto authHeader =
        req->getHeader("Authorization");
    if (authHeader.size() <= 7) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "Missing or malformed token"));
        return;
    }
    auto token = authHeader.substr(7);

    services::AuthService auth;
    auth.logoutUser(
        token,
        [cb](const services::json&) {
            auto resp = ::utils::jsonOk(
                {{"message", "Logged out"}});
            // Clear the SSO cookie on logout.
            drogon::Cookie sso(
                "nextra_sso", "");
            sso.setHttpOnly(true);
            sso.setPath("/");
            sso.setMaxAge(0);
            resp->addCookie(sso);
            cb(resp);
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

void AuthTokenController::refresh(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto body = json::parse(
        req->bodyData(),
        req->bodyData() + req->bodyLength(),
        nullptr, false);
    if (body.is_discarded()) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "refresh_token required"));
        return;
    }

    auto rt = extractRefreshToken(body);
    if (rt.empty()) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "refresh_token required"));
        return;
    }

    services::AuthService auth;
    auth.refreshAccessToken(
        rt,
        [cb](const services::json& res) {
            cb(::utils::jsonOk(res));
        },
        [cb](drogon::HttpStatusCode c,
             const std::string& m) {
            cb(::utils::jsonError(c, m));
        });
}

} // namespace controllers
