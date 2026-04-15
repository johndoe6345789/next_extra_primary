/**
 * @file CookieAuthFilter.cpp
 * @brief Cookie-based auth with Bearer fallback.
 */

#include "CookieAuthFilter.h"
#include "../services/AuthService.h"
#include "../utils/JsonResponse.h"
#include "../utils/JwtUtil.h"

#include <string>
#include <string_view>

namespace filters
{

namespace
{
constexpr std::string_view kBearer = "Bearer ";
}

void CookieAuthFilter::doFilter(
    const drogon::HttpRequestPtr& req,
    drogon::FilterCallback&& cb,
    drogon::FilterChainCallback&& ccb)
{
    // Try cookie first, then Bearer header.
    auto token =
        req->getCookie("nextra_sso");
    if (token.empty()) {
        auto auth =
            req->getHeader("Authorization");
        if (auth.size() > kBearer.size()
            && auth.substr(0, kBearer.size())
                   == kBearer) {
            token =
                auth.substr(kBearer.size());
        }
    }

    if (token.empty()) {
        cb(::utils::jsonError(
            drogon::k401Unauthorized,
            "Authentication required",
            "AUTH_006"));
        return;
    }

    utils::JwtClaims claims;
    try {
        claims = ::utils::verifyToken(token);
    } catch (...) {
        cb(::utils::jsonError(
            drogon::k401Unauthorized,
            "Invalid token", "AUTH_005"));
        return;
    }

    // Reject refresh tokens: they must NEVER be
    // accepted as access tokens. A refresh token
    // used here would bypass the short-lived
    // access-token policy entirely.
    if (claims.isRefresh) {
        cb(::utils::jsonError(
            drogon::k401Unauthorized,
            "Refresh token not allowed",
            "AUTH_007"));
        return;
    }

    auto userId = claims.userId;
    auto role = claims.role;

    services::AuthService auth;
    auth.isTokenBlocked(
        token,
        [req, cb, ccb = std::move(ccb),
         userId, role](bool blocked) mutable {
        if (blocked) {
            cb(::utils::jsonError(
                drogon::k401Unauthorized,
                "Token revoked", "AUTH_004"));
            return;
        }
        req->attributes()->insert(
            "user_id", userId);
        req->attributes()->insert(
            "user_role", role);
        ccb();
    });
}

} // namespace filters
