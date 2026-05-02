/**
 * @brief JWT auth filter — Keycloak-only verification.
 *
 * Bearer tokens MUST be Keycloak-issued RS256 access
 * tokens. The legacy in-house HS256 path was removed in
 * Phase 4 of the Keycloak migration once all consumers
 * had migrated.
 *
 * On success, exposes `user_id` and `user_role` in the
 * request attributes for downstream controllers.
 */
#include "JwtAuthFilter.h"
#include "drogon-host/backend/utils/JsonResponse.h"
#include "auth/backend/keycloak/KeycloakVerifier.h"
#include "auth/backend/keycloak/UserProvision.h"

#include <drogon/drogon.h>
#include <string>
#include <string_view>

namespace filters
{

namespace
{
constexpr std::string_view kBearerPrefix = "Bearer ";
}  // anonymous namespace

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

    auto kc =
        services::auth::keycloak::defaultVerifier()
            .verify(token);
    if (!kc) {
        cb(::utils::jsonError(
            drogon::k401Unauthorized,
            "Invalid or expired token",
            "AUTH_005"));
        return;
    }

    req->attributes()->insert("user_id", kc->sub);
    const std::string role =
        kc->roles.empty() ? std::string{"user"}
                          : kc->roles.front();
    req->attributes()->insert("user_role", role);
    // JIT-provision the in-house users row for new
    // Keycloak identities (e.g. self-registered or
    // federated). Idempotent + cached per process.
    services::auth::keycloak::ensureUserRow(*kc);
    ccb();
}

}  // namespace filters
