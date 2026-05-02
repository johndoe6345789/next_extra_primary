/** @brief JWT filter — supports both legacy in-house
 *         HS256 tokens and Keycloak-issued RS256 access
 *         tokens during the auth migration. */
#include "JwtAuthFilter.h"
#include "drogon-host/backend/utils/JsonResponse.h"
#include "drogon-host/backend/utils/JwtUtil.h"
#include "auth/backend/keycloak/KeycloakVerifier.h"

#include <drogon/drogon.h>
#include <spdlog/spdlog.h>
#include <string>
#include <string_view>

namespace filters
{

namespace
{
constexpr std::string_view kBearerPrefix = "Bearer ";

void checkBlocklist(
    const std::string& jti,
    std::function<void(bool)> cb)
{
    auto db = drogon::app().getDbClient();
    *db << "SELECT 1 FROM token_blocklist "
           "WHERE jti=$1 LIMIT 1"
        << jti
        >> [cb](const drogon::orm::Result& r) {
            cb(!r.empty());
        }
        >> [cb](const drogon::orm::DrogonDbException& e) {
            spdlog::error("blocklist check: {}",
                e.base().what());
            cb(true); // fail closed on DB error
        };
}
} // anonymous namespace

void JwtAuthFilter::doFilter(
    const drogon::HttpRequestPtr& req,
    drogon::FilterCallback&& cb,
    drogon::FilterChainCallback&& ccb)
{
    auto authHeader =
        req->getHeader("Authorization");
    if (authHeader.empty()) {
        cb(::utils::jsonError(
            drogon::k401Unauthorized,
            "Missing Authorization header",
            "AUTH_006"));
        return;
    }
    if (authHeader.substr(
            0, kBearerPrefix.size())
            != kBearerPrefix) {
        cb(::utils::jsonError(
            drogon::k401Unauthorized,
            "Invalid Authorization format",
            "AUTH_005"));
        return;
    }

    const auto token =
        authHeader.substr(kBearerPrefix.size());

    // Try Keycloak first; on success, skip blocklist
    // (Keycloak revocation is via realm session ops).
    if (auto kc =
            services::auth::keycloak::defaultVerifier()
                .verify(token)) {
        req->attributes()->insert("user_id", kc->sub);
        const std::string role =
            kc->roles.empty() ? std::string{"user"}
                              : kc->roles.front();
        req->attributes()->insert("user_role", role);
        ccb();
        return;
    }

    try {
        auto claims = ::utils::verifyToken(token);
        if (claims.isRefresh) {
            cb(::utils::jsonError(
                drogon::k401Unauthorized,
                "Refresh tokens cannot be used here",
                "AUTH_005"));
            return;
        }
        const auto userId = claims.userId;
        const auto role   = claims.role;
        checkBlocklist(
            token,
            [req, cb, ccb = std::move(ccb),
             userId, role](bool blocked) mutable {
                if (blocked) {
                    cb(::utils::jsonError(
                        drogon::k401Unauthorized,
                        "Token has been revoked",
                        "AUTH_004"));
                    return;
                }
                req->attributes()->insert(
                    "user_id", userId);
                req->attributes()->insert(
                    "user_role", role);
                ccb();
            });
    } catch (const std::exception& ex) {
        cb(::utils::jsonError(
            drogon::k401Unauthorized,
            std::string{"Invalid token: "}
                + ex.what(),
            "AUTH_005"));
    }
}

} // namespace filters
