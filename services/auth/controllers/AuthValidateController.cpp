/**
 * @file AuthValidateController.cpp
 * @brief SSO token-validation endpoint for nginx auth_request.
 *
 * Reads the `nextra_sso` cookie (contains the refresh token set
 * at login) and returns 200 OK or 401 Unauthorized.
 * nginx uses the status code only — no body is forwarded.
 */

#include "AuthValidateController.h"
#include "auth/backend/AuthService.h"
#include "drogon-host/backend/utils/JwtUtil.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <drogon/HttpResponse.h>
#include <string>

using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;

namespace controllers
{

void AuthValidateController::validate(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    const auto token =
        req->getCookie("nextra_sso");

    if (token.empty()) {
        cb(::utils::jsonError(
            drogon::k401Unauthorized,
            "No SSO cookie", "AUTH_006"));
        return;
    }

    utils::JwtClaims claims;
    try {
        claims = ::utils::verifyToken(token);
    } catch (...) {
        cb(::utils::jsonError(
            drogon::k401Unauthorized,
            "Invalid SSO token", "AUTH_005"));
        return;
    }

    // Refresh tokens are accepted here — the cookie holds
    // the refresh token intentionally for longer sessions.
    // (It is never forwarded to upstream APIs as a Bearer.)
    // Role enforcement happens at cookie-issuance time in
    // AuthController::login (guest users get no cookie).

    services::AuthService auth;
    auto userId = claims.userId;
    auth.isTokenBlocked(
        token,
        [cb, userId](bool blocked) mutable {
            if (blocked) {
                cb(::utils::jsonError(
                    drogon::k401Unauthorized,
                    "Token revoked", "AUTH_004"));
                return;
            }
            auto resp =
                drogon::HttpResponse
                    ::newHttpResponse();
            resp->setStatusCode(drogon::k200OK);
            resp->addHeader("X-User-Id", userId);
            cb(resp);
        });
}

} // namespace controllers
