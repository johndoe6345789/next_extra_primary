#pragma once

/**
 * @file s3_signer_hash.h
 * @brief HMAC-SHA256 and SHA-256 helpers for AWS SigV4.
 */

#include <cstdint>
#include <string>
#include <vector>

namespace nextra::image::s3_signer
{

/**
 * @brief Compute HMAC-SHA256 using OpenSSL EVP_MAC.
 * @param key  Raw bytes used as the HMAC key.
 * @param data String to authenticate.
 * @return 32-byte digest.
 */
std::vector<uint8_t> hmacSha256(
    const std::vector<uint8_t>& key,
    const std::string& data);

/**
 * @brief Compute SHA-256 of a string, hex-encoded.
 * @param data Input data.
 * @return 64-character lowercase hex string.
 */
std::string sha256Hex(const std::string& data);

}  // namespace nextra::image::s3_signer
