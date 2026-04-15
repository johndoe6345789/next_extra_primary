/**
 * @file AuthLogin.cpp
 * @brief Login endpoint implementation.
 *
 * Sets the `nextra_sso` HttpOnly cookie for users
 * with role >= user so nginx auth_request can gate
 * all portal tools. Guest-role users authenticate
 * normally but receive no SSO cookie.
 *
 * Role is checked here at login time because refresh
 * tokens carry no role claim (only userId + type).
 */

#include "AuthController.h"
#include "auth/backend/AuthService.h"
#include "drogon-host/backend/utils/JsonResponse.h"
#include "drogon-host/backend/utils/RoleCheck.h"

#include <drogon/Cookie.h>
#include <drogon/HttpResponse.h>
#include <nlohmann/json.hpp>
#include <string>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;

namespace controllers
{

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
            auto userRole =
                (payload.contains("user") &&
                 payload["user"].contains("role"))
                ? payload["user"]["role"]
                    .get<std::string>() : "";
            if (utils::hasRole(userRole, "user") &&
                payload.contains("tokens") &&
                payload["tokens"]
                    .contains("refreshToken")) {
                auto rt =
                    payload["tokens"]["refreshToken"]
                    .get<std::string>();
                drogon::Cookie sso("nextra_sso", rt);
                sso.setHttpOnly(true);
                sso.setPath("/");
                sso.setSameSite(
                    drogon::Cookie::SameSite::kLax);
                sso.setMaxAge(30 * 24 * 3600);
                resp->addCookie(sso);
            }
            cb(resp);
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            std::string errCode = "AUTH_001";
            if (code == drogon::k403Forbidden)
                errCode = "AUTH_008";
            cb(::utils::jsonError(
                code, msg, errCode));
        });
}

} // namespace controllers
