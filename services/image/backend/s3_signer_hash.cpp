/**
 * @file s3_signer_hash.cpp
 * @brief HMAC-SHA256 and SHA-256 via OpenSSL EVP_MAC / EVP_MD.
 */

#include "image/backend/s3_signer_hash.h"

#include <openssl/evp.h>
#include <openssl/hmac.h>
#include <openssl/sha.h>
#include <spdlog/spdlog.h>

#include <array>
#include <iomanip>
#include <sstream>
#include <stdexcept>

namespace nextra::image::s3_signer
{

std::vector<uint8_t> hmacSha256(
    const std::vector<uint8_t>& key,
    const std::string& data)
{
    unsigned int len = 0;
    std::vector<uint8_t> out(EVP_MAX_MD_SIZE);
    const auto* raw = HMAC(
        EVP_sha256(),
        key.data(),
        static_cast<int>(key.size()),
        reinterpret_cast<const unsigned char*>(
            data.data()),
        data.size(),
        out.data(),
        &len);
    if (!raw)
    {
        spdlog::error("hmacSha256: OpenSSL HMAC failed");
        throw std::runtime_error("HMAC-SHA256 failed");
    }
    out.resize(len);
    return out;
}

std::string sha256Hex(const std::string& data)
{
    std::array<unsigned char, SHA256_DIGEST_LENGTH> digest{};
    SHA256(
        reinterpret_cast<const unsigned char*>(data.data()),
        data.size(),
        digest.data());
    std::ostringstream oss;
    oss << std::hex << std::setfill('0');
    for (auto b : digest)
        oss << std::setw(2) << static_cast<int>(b);
    return oss.str();
}

}  // namespace nextra::image::s3_signer
