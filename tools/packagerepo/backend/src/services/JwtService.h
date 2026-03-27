/**
 * @file JwtService.h
 * @brief Minimal HS256 JWT implementation using OpenSSL.
 */

#pragma once

#include <drogon/utils/Utilities.h>
#include <json/json.h>
#include <openssl/hmac.h>

#include <chrono>
#include <cstdint>
#include <string>

namespace repo
{

/// @brief Base64url encode (RFC 4648 sec 5).
inline std::string b64url(const std::string& in)
{
    auto b = drogon::utils::base64Encode(in);
    for (auto& c : b) {
        if (c == '+') c = '-';
        else if (c == '/') c = '_';
    }
    b.erase(std::remove(b.begin(), b.end(), '='), b.end());
    return b;
}

/// @brief Sign data with HMAC-SHA256, return base64url.
inline std::string hmacSign(const std::string& data,
                            const std::string& secret)
{
    unsigned char out[32];
    unsigned int len = 0;
    HMAC(EVP_sha256(), secret.data(), (int)secret.size(),
         (const unsigned char*)data.data(), data.size(),
         out, &len);
    return b64url(std::string((char*)out, len));
}

/// @brief Create a JWT with sub, scopes, and exp claims.
inline std::string createJwt(const std::string& sub,
                             const Json::Value& scopes,
                             const std::string& secret,
                             int64_t expHours = 24)
{
    auto now = std::chrono::system_clock::now();
    auto exp = now + std::chrono::hours(expHours);
    auto expSec = std::chrono::duration_cast<
        std::chrono::seconds>(exp.time_since_epoch())
                      .count();

    auto header = b64url(R"({"alg":"HS256","typ":"JWT"})");

    Json::Value pay;
    pay["sub"] = sub;
    pay["scopes"] = scopes;
    pay["exp"] = (Json::Int64)expSec;
    Json::StreamWriterBuilder w;
    w["indentation"] = "";
    auto payload = b64url(Json::writeString(w, pay));

    auto sig = hmacSign(header + "." + payload, secret);
    return header + "." + payload + "." + sig;
}

/// @brief Verify JWT, return payload or empty on failure.
inline Json::Value verifyJwt(const std::string& token,
                             const std::string& secret)
{
    auto d1 = token.find('.');
    auto d2 = token.find('.', d1 + 1);
    if (d1 == std::string::npos || d2 == std::string::npos)
        return {};

    auto hdr = token.substr(0, d1);
    auto pay = token.substr(d1 + 1, d2 - d1 - 1);
    auto sig = token.substr(d2 + 1);

    if (hmacSign(hdr + "." + pay, secret) != sig)
        return {};

    // Pad base64url back to base64
    auto padded = pay;
    for (auto& c : padded) {
        if (c == '-') c = '+';
        else if (c == '_') c = '/';
    }
    while (padded.size() % 4) padded += '=';

    auto json = drogon::utils::base64Decode(padded);
    Json::Value root;
    Json::CharReaderBuilder rb;
    std::istringstream ss(json);
    Json::parseFromStream(rb, ss, &root, nullptr);

    auto now = std::chrono::duration_cast<
        std::chrono::seconds>(
        std::chrono::system_clock::now()
            .time_since_epoch())
                   .count();
    if (root["exp"].asInt64() < now) return {};

    return root;
}

} // namespace repo
