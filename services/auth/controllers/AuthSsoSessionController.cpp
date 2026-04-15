/**
 * @file AuthSsoSessionController.cpp
 * @brief Cookie-to-session bootstrap endpoint.
 *
 * Reads the `nextra_sso` HttpOnly cookie, validates the
 * refresh token, and delegates to ssoSessionLookup to
 * fetch the user profile and issue a fresh access token.
 * The main app calls this on startup so tokens never
 * need to live in localStorage.
 */

#include "AuthSsoSessionController.h"
#include "auth/backend/AuthService.h"
#include "auth/backend/sso_session_lookup.h"
#include "drogon-host/backend/utils/JsonResponse.h"
#include "drogon-host/backend/utils/JwtUtil.h"

#include <drogon/drogon.h>

using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;

namespace controllers
{

void AuthSsoSessionController::session(
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

    services::AuthService auth;
    auth.isTokenBlocked(
        token,
        [cb, claims](bool blocked) mutable {
            if (blocked) {
                cb(::utils::jsonError(
                    drogon::k401Unauthorized,
                    "Token revoked", "AUTH_004"));
                return;
            }
            services::ssoSessionLookup(
                claims.userId,
                [cb](const services::json& d) {
                    cb(::utils::jsonOk(d));
                },
                [cb](drogon::HttpStatusCode code,
                     const std::string& msg) {
                    cb(::utils::jsonError(
                        code, msg, "AUTH_007"));
                });
        });
}

} // namespace controllers
