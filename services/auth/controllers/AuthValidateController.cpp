/**
 * @file AuthValidateController.cpp
 * @brief SSO token-validation endpoint for nginx auth_request.
 *
 * Reads the `nextra_sso` cookie. The cookie value may be either
 * a Keycloak RS256 access token (new path) or the in-house
 * HS256 token (legacy path). Both are accepted during the
 * Keycloak migration.
 */

#include "AuthValidateController.h"
#include "auth/backend/AuthService.h"
#include "auth/backend/keycloak/KeycloakVerifier.h"
#include "drogon-host/backend/utils/JwtUtil.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <drogon/HttpResponse.h>
#include <string>

using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;

namespace controllers
{

static drogon::HttpResponsePtr buildOk(
    const std::string& userId,
    const std::string& email,
    const std::string& roles)
{
    auto resp = drogon::HttpResponse::newHttpResponse();
    resp->setStatusCode(drogon::k200OK);
    resp->addHeader("X-User-Id", userId);
    if (!email.empty())
        resp->addHeader("X-User-Email", email);
    if (!roles.empty())
        resp->addHeader("X-User-Roles", roles);
    return resp;
}

static std::string joinRoles(
    const std::vector<std::string>& roles)
{
    std::string out;
    for (const auto& r : roles) {
        if (!out.empty()) out += ',';
        out += r;
    }
    return out;
}

void AuthValidateController::validate(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    const auto token = req->getCookie("nextra_sso");
    if (token.empty()) {
        cb(::utils::jsonError(
            drogon::k401Unauthorized,
            "No SSO cookie", "AUTH_006"));
        return;
    }

    // 1. Try Keycloak RS256 path.
    auto kc = services::auth::keycloak::defaultVerifier()
                  .verify(token);
    if (kc) {
        cb(buildOk(kc->sub, kc->email,
                   joinRoles(kc->roles)));
        return;
    }

    // 2. Fallback: legacy in-house HS256 token.
    utils::JwtClaims claims;
    try {
        claims = ::utils::verifyToken(token);
    } catch (...) {
        cb(::utils::jsonError(
            drogon::k401Unauthorized,
            "Invalid SSO token", "AUTH_005"));
        return;
    }

    services::AuthService auth;
    auto userId = claims.userId;
    auto role = claims.role;
    auth.isTokenBlocked(
        token,
        [cb, userId, role](bool blocked) mutable {
            if (blocked) {
                cb(::utils::jsonError(
                    drogon::k401Unauthorized,
                    "Token revoked", "AUTH_004"));
                return;
            }
            cb(buildOk(userId, "", role));
        });
}

} // namespace controllers
