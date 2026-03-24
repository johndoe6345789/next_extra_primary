/**
 * @file JwtUtil.cpp
 * @brief JWT token generation and verification.
 */
#include "JwtUtil.h"

#include <chrono>
#include <cstdlib>
#include <drogon/drogon.h>
#define JWT_DISABLE_PICOJSON
#include <jwt-cpp/traits/nlohmann-json/defaults.h>
#include <spdlog/spdlog.h>

namespace utils
{
namespace
{
constexpr int kAccessMinutes = 15;
constexpr int kRefreshDays = 30;
constexpr auto kDefaultIssuer = "next-extra";
constexpr auto kDevSecret = "dev-secret-change-in-production";

auto cfgVal(const std::string& key) -> std::string
{
    auto& jwt = drogon::app().getCustomConfig()["jwt"];
    if (jwt.isMember(key) && jwt[key].isString() &&
        !jwt[key].asString().empty()) {
        return jwt[key].asString();
    }
    return {};
}
} // namespace

auto getSecret() -> std::string
{
    auto val = cfgVal("secret");
    if (!val.empty()) {
        return val;
    }
    if (const char* env = std::getenv("JWT_SECRET");
        env != nullptr && env[0] != '\0') {
        return std::string{env};
    }
    spdlog::warn("JWT secret not configured; "
                 "using insecure dev default");
    return kDevSecret;
}

auto getIssuer() -> std::string
{
    auto val = cfgVal("issuer");
    return val.empty() ? kDefaultIssuer : val;
}

auto generateAccessToken(const std::string& userId,
                         const std::string& role) -> std::string
{
    auto now = std::chrono::system_clock::now();
    return jwt::create()
        .set_issuer(getIssuer())
        .set_type("JWT")
        .set_subject(userId)
        .set_payload_claim("role", jwt::claim(role))
        .set_payload_claim("type", jwt::claim(std::string{"access"}))
        .set_issued_at(now)
        .set_expires_at(now + std::chrono::minutes{kAccessMinutes})
        .sign(jwt::algorithm::hs256{getSecret()});
}

auto generateRefreshToken(const std::string& userId) -> std::string
{
    auto now = std::chrono::system_clock::now();
    return jwt::create()
        .set_issuer(getIssuer())
        .set_type("JWT")
        .set_subject(userId)
        .set_payload_claim("type", jwt::claim(std::string{"refresh"}))
        .set_issued_at(now)
        .set_expires_at(now + std::chrono::hours{kRefreshDays * 24})
        .sign(jwt::algorithm::hs256{getSecret()});
}

auto verifyToken(const std::string& token) -> JwtClaims
{
    auto verifier = jwt::verify()
                        .allow_algorithm(jwt::algorithm::hs256{getSecret()})
                        .with_issuer(getIssuer());
    auto decoded = jwt::decode(token);
    verifier.verify(decoded);
    JwtClaims claims;
    claims.userId = decoded.get_subject();
    if (decoded.has_payload_claim("role")) {
        claims.role = decoded.get_payload_claim("role").as_string();
    }
    if (decoded.has_payload_claim("type")) {
        claims.isRefresh =
            decoded.get_payload_claim("type").as_string() == "refresh";
    }
    return claims;
}
} // namespace utils
