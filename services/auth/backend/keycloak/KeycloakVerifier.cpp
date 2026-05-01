/**
 * @file KeycloakVerifier.cpp
 * @brief RS256 + claims verification against Keycloak.
 */

#include "KeycloakVerifier.h"

#define JWT_DISABLE_PICOJSON
#include <jwt-cpp/traits/nlohmann-json/defaults.h>
#include <spdlog/spdlog.h>

namespace services::auth::keycloak
{

KeycloakVerifier::KeycloakVerifier(JwksClient& jwks)
    : jwks_(jwks)
{
}

static bool audOk(const jwt::decoded_jwt<
                  jwt::traits::nlohmann_json>& d)
{
    if (!d.has_audience()) return false;
    for (const auto& a : d.get_audience()) {
        if (a == kKcClientId || a == "account")
            return true;
    }
    return false;
}

std::optional<KeycloakClaims> KeycloakVerifier::verify(
    const std::string& token) const
{
    try {
        auto decoded = jwt::decode(token);
        if (!decoded.has_key_id()) return std::nullopt;
        auto pem = jwks_.getPublicKeyPem(
            decoded.get_key_id());
        if (!pem) return std::nullopt;

        auto v = jwt::verify()
                     .allow_algorithm(
                         jwt::algorithm::rs256(*pem))
                     .with_issuer(kKcIssuer);
        v.verify(decoded);  // exp + signature + iss

        if (!audOk(decoded)) return std::nullopt;

        KeycloakClaims c;
        c.sub = decoded.get_subject();
        const auto& payload = decoded.get_payload_json();
        if (payload.contains("preferred_username"))
            c.preferredUsername =
                payload["preferred_username"]
                    .get<std::string>();
        if (payload.contains("email"))
            c.email = payload["email"].get<std::string>();
        if (payload.contains("name"))
            c.name = payload["name"].get<std::string>();
        if (payload.contains("realm_access")
            && payload["realm_access"].contains("roles")) {
            for (const auto& r :
                 payload["realm_access"]["roles"]) {
                if (r.is_string())
                    c.roles.push_back(
                        r.get<std::string>());
            }
        }
        return c;
    } catch (const std::exception& e) {
        spdlog::debug("KC verify fail: {}", e.what());
        return std::nullopt;
    }
}

KeycloakVerifier& defaultVerifier()
{
    static JwksClient jwks{kKcInternalJwks};
    static KeycloakVerifier v{jwks};
    return v;
}

} // namespace services::auth::keycloak
