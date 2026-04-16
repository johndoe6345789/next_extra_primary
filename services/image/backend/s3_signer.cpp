/**
 * @file s3_signer.cpp
 * @brief AWS Signature Version 4 Authorization header builder.
 */

#include "image/backend/s3_signer.h"

#include "image/backend/s3_signer_hash.h"

#include <spdlog/spdlog.h>

#include <format>
#include <sstream>

namespace nextra::image::s3_signer
{

namespace
{

/// Convert raw bytes to lowercase hex string.
std::string toHex(const std::vector<uint8_t>& bytes)
{
    std::ostringstream oss;
    oss << std::hex << std::setfill('0');
    for (auto b : bytes)
        oss << std::setw(2) << static_cast<int>(b);
    return oss.str();
}

/// Derive signing key via HMAC chain per AWS spec.
std::vector<uint8_t> signingKey(
    const std::string& secretKey,
    const std::string& dateShort,
    const std::string& region)
{
    const std::string prefix = "AWS4" + secretKey;
    auto k = std::vector<uint8_t>(
        prefix.begin(), prefix.end());
    k = hmacSha256(k, dateShort);
    k = hmacSha256(k, region);
    k = hmacSha256(k, "s3");
    k = hmacSha256(k, "aws4_request");
    return k;
}

}  // namespace

std::string buildAuthHeader(
    const std::string& method,
    const std::string& bucket,
    const std::string& key,
    const std::string& payloadHash,
    const std::string& accessKey,
    const std::string& secretKey,
    const std::string& region,
    const std::string& dateTimeISO)
{
    const std::string dateShort = dateTimeISO.substr(0, 8);
    const std::string host =
        bucket + ".s3." + region + ".amazonaws.com";

    // 1. Canonical request
    const std::string canonical = std::format(
        "{}\n/{}\n\nhost:{}\nx-amz-content-sha256:{}\n"
        "x-amz-date:{}\n\nhost;x-amz-content-sha256;"
        "x-amz-date\n{}",
        method, key, host,
        payloadHash, dateTimeISO, payloadHash);

    // 2. String to sign
    const std::string scope = std::format(
        "{}/{}/s3/aws4_request",
        dateShort, region);
    const std::string sts = std::format(
        "AWS4-HMAC-SHA256\n{}\n{}\n{}",
        dateTimeISO, scope, sha256Hex(canonical));

    // 3. Signing key + signature
    const auto sk = signingKey(
        secretKey, dateShort, region);
    const std::string sig =
        toHex(hmacSha256(sk, sts));

    spdlog::debug(
        "s3_signer: date={} scope={}", dateShort, scope);

    return std::format(
        "AWS4-HMAC-SHA256 Credential={}/{},SignedHeaders="
        "host;x-amz-content-sha256;x-amz-date,Signature={}",
        accessKey, scope, sig);
}

}  // namespace nextra::image::s3_signer
