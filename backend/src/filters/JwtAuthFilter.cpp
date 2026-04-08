/**
 * @file JwtAuthFilter.cpp
 * @brief JWT Bearer token validation filter.
 */

#include "JwtAuthFilter.h"
#include "../services/AuthService.h"
#include "../utils/JsonResponse.h"
#include "../utils/JwtUtil.h"

#include <string>
#include <string_view>

namespace filters
{

namespace
{
constexpr std::string_view kBearerPrefix = "Bearer ";
}

void JwtAuthFilter::doFilter(const drogon::HttpRequestPtr& req,
                             drogon::FilterCallback&& cb,
                             drogon::FilterChainCallback&& ccb)
{
    auto authHeader = req->getHeader("Authorization");
    if (authHeader.empty()) {
        cb(::utils::jsonError(drogon::k401Unauthorized,
                              "Missing Authorization header",
                              "AUTH_006"));
        return;
    }

    if (authHeader.substr(0, kBearerPrefix.size()) != kBearerPrefix) {
        cb(::utils::jsonError(drogon::k401Unauthorized,
                              "Invalid Authorization format",
                              "AUTH_005"));
        return;
    }

    auto token = authHeader.substr(kBearerPrefix.size());

    try {
        auto claims = ::utils::verifyToken(token);
        if (claims.isRefresh) {
            cb(::utils::jsonError(drogon::k401Unauthorized,
                                  "Refresh tokens cannot be used here",
                                  "AUTH_005"));
            return;
        }

        // Capture what downstream handlers need before the
        // async blocklist check so lambdas stay self-contained.
        auto userId = claims.userId;
        auto role = claims.role;

        services::AuthService auth;
        auth.isTokenBlocked(token, [req, cb, ccb = std::move(ccb), userId,
                                    role](bool blocked) mutable {
            if (blocked) {
                cb(::utils::jsonError(drogon::k401Unauthorized,
                                      "Token has been revoked",
                                      "AUTH_004"));
                return;
            }
            req->attributes()->insert("user_id", userId);
            req->attributes()->insert("user_role", role);
            ccb();
        });
    } catch (const std::exception& ex) {
        cb(::utils::jsonError(
            drogon::k401Unauthorized,
            std::string{"Invalid token: "} + ex.what(),
            "AUTH_005"));
    }
}

} // namespace filters
