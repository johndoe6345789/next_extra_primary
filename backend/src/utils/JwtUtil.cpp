/**
 * @file JwtUtil.cpp
 * @brief JWT token generation and verification using jwt-cpp.
 */

#include "JwtUtil.h"

#include <jwt-cpp/jwt.h>
#include <chrono>
#include <cstdlib>
#include <stdexcept>

namespace utils {

namespace {
constexpr int kAccessTokenMinutes  = 15;
constexpr int kRefreshTokenDays    = 30;
constexpr auto kIssuer             = "next-extra";
}  // namespace

auto getSecret() -> std::string
{
    if (const char *env = std::getenv("JWT_SECRET")) {
        return std::string{env};
    }
    // Fallback for development only.
    return "dev-secret-change-in-production";
}

auto generateAccessToken(
    const std::string &userId,
    const std::string &role) -> std::string
{
    auto now = std::chrono::system_clock::now();

    return jwt::create()
        .set_issuer(kIssuer)
        .set_type("JWT")
        .set_subject(userId)
        .set_payload_claim("role", jwt::claim(role))
        .set_payload_claim("type", jwt::claim(std::string{"access"}))
        .set_issued_at(now)
        .set_expires_at(now + std::chrono::minutes{kAccessTokenMinutes})
        .sign(jwt::algorithm::hs256{getSecret()});
}

auto generateRefreshToken(
    const std::string &userId) -> std::string
{
    auto now = std::chrono::system_clock::now();

    return jwt::create()
        .set_issuer(kIssuer)
        .set_type("JWT")
        .set_subject(userId)
        .set_payload_claim("type", jwt::claim(std::string{"refresh"}))
        .set_issued_at(now)
        .set_expires_at(
            now + std::chrono::hours{kRefreshTokenDays * 24})
        .sign(jwt::algorithm::hs256{getSecret()});
}

auto verifyToken(const std::string &token) -> JwtClaims
{
    auto verifier = jwt::verify()
        .allow_algorithm(jwt::algorithm::hs256{getSecret()})
        .with_issuer(kIssuer);

    auto decoded = jwt::decode(token);
    verifier.verify(decoded);

    JwtClaims claims;
    claims.userId = decoded.get_subject();

    if (decoded.has_payload_claim("role")) {
        claims.role = decoded.get_payload_claim("role")
                          .as_string();
    }
    if (decoded.has_payload_claim("type")) {
        claims.isRefresh =
            decoded.get_payload_claim("type").as_string()
            == "refresh";
    }
    return claims;
}

}  // namespace utils
