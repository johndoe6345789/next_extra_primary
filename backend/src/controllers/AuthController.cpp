/**
 * @file AuthController.cpp
 * @brief Core authentication: register and login.
 *
 * On successful login, sets the `nextra_sso` HttpOnly cookie
 * containing the refresh token so the nginx auth_request SSO
 * gate can validate sessions for all portal sub-tools.
 */

#include "AuthController.h"
#include "../services/AuthService.h"
#include "../utils/JsonResponse.h"

#include <drogon/Cookie.h>
#include <drogon/HttpResponse.h>
#include <nlohmann/json.hpp>
#include <string>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;

namespace controllers
{

void AuthController::registerUser(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto body = json::parse(
        req->bodyData(),
        req->bodyData() + req->bodyLength(),
        nullptr, false);
    if (body.is_discarded() ||
        !body.contains("email") ||
        !body.contains("username") ||
        !body.contains("password")) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "Missing required fields", "VAL_004"));
        return;
    }

    auto email =
        body["email"].get<std::string>();
    auto username =
        body["username"].get<std::string>();
    auto password =
        body["password"].get<std::string>();
    auto displayName =
        body.value("display_name", username);

    services::AuthService auth;
    auth.registerUser(
        email, username, password, displayName,
        [cb](const services::json& payload) {
            cb(::utils::jsonCreated(payload));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

// ----------------------------------------------------------
void AuthController::login(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto body = json::parse(
        req->bodyData(),
        req->bodyData() + req->bodyLength(),
        nullptr, false);
    if (body.is_discarded() ||
        !body.contains("email") ||
        !body.contains("password")) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "Email and password required",
            "VAL_004"));
        return;
    }

    auto email =
        body["email"].get<std::string>();
    auto password =
        body["password"].get<std::string>();

    services::AuthService auth;
    auth.loginUser(
        email, password,
        [cb](const services::json& payload) {
            auto resp = ::utils::jsonOk(payload);
            // Set SSO cookie from the refresh token
            // so nginx auth_request can gate tools.
            if (payload.contains("refresh_token")) {
                auto rt = payload["refresh_token"]
                    .get<std::string>();
                drogon::Cookie sso("nextra_sso", rt);
                sso.setHttpOnly(true);
                sso.setPath("/");
                sso.setSameSite(
                    drogon::Cookie::SameSite::kLax);
                // 30 days in seconds
                sso.setMaxAge(30 * 24 * 3600);
                resp->addCookie(sso);
            }
            cb(resp);
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            std::string errCode = "AUTH_001";
            if (code == drogon::k403Forbidden) {
                errCode = "AUTH_008";
            }
            cb(::utils::jsonError(
                code, msg, errCode));
        });
}

} // namespace controllers
