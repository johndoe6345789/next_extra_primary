/**
 * @file HmacSigner.cpp
 * @brief OpenSSL-backed implementation of signHmacSha256.
 */

#include "services/webhooks/HmacSigner.h"

#include <openssl/hmac.h>
#include <openssl/evp.h>

#include <array>
#include <cstdio>

namespace nextra::webhooks
{

static std::string toHex(const unsigned char* buf, unsigned int len)
{
    static const char kHex[] = "0123456789abcdef";
    std::string out;
    out.resize(static_cast<std::size_t>(len) * 2U);
    for (unsigned int i = 0; i < len; ++i)
    {
        out[i * 2U]     = kHex[(buf[i] >> 4) & 0x0F];
        out[i * 2U + 1] = kHex[buf[i] & 0x0F];
    }
    return out;
}

std::string signHmacSha256(const std::string& secret,
                           const std::string& timestamp,
                           const std::string& body)
{
    const std::string canonical = timestamp + "." + body;
    std::array<unsigned char, EVP_MAX_MD_SIZE> digest{};
    unsigned int digestLen = 0;
    const auto* md = EVP_sha256();
    const auto* key = reinterpret_cast<const unsigned char*>(secret.data());
    const auto* data = reinterpret_cast<const unsigned char*>(
        canonical.data());
    if (!HMAC(md, key, static_cast<int>(secret.size()),
              data, canonical.size(), digest.data(), &digestLen))
    {
        return {};
    }
    return toHex(digest.data(), digestLen);
}

}  // namespace nextra::webhooks
