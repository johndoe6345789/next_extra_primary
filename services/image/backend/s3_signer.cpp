/**
 * @file s3_signer.cpp
 * @brief AWS Signature Version 4 canonical request
 *        builder and signing-key derivation.
 */

#include "image/backend/s3_signer.h"

#include <format>
#include <sstream>

namespace nextra::image::s3_signer
{

namespace
{

/// @brief Derive the SigV4 signing key.
std::vector<unsigned char> signingKey(
    const std::string& secretKey,
    const std::string& date,      // YYYYMMDD
    const std::string& region,
    const std::string& service)
{
    auto k1 = hmac256(
        "AWS4" + secretKey, date);
    auto k2 = hmac256(k1, region);
    auto k3 = hmac256(k2, service);
    return hmac256(k3, "aws4_request");
}

/// @brief Build canonical request string.
std::string canonicalRequest(
    const std::string& method,
    const std::string& uri,
    const std::string& query,
    const std::string& host,
    const std::string& date8601,
    const std::string& payloadHash)
{
    std::ostringstream cr;
    cr << method << '\n'
       << uri << '\n'
       << query << '\n'
       << "host:" << host << '\n'
       << "x-amz-content-sha256:"
       << payloadHash << '\n'
       << "x-amz-date:" << date8601 << '\n'
       << '\n'
       << "host;x-amz-content-sha256;x-amz-date"
       << '\n'
       << payloadHash;
    return cr.str();
}

}  // anonymous namespace

std::string signRequest(
    const std::string& method,
    const std::string& uri,
    const std::string& query,
    const std::string& host,
    const std::string& date8601,
    const std::string& payload,
    const std::string& accessKey,
    const std::string& secretKey,
    const std::string& region,
    const std::string& service)
{
    const std::string date8 = date8601.substr(0, 8);
    const std::string payloadHash = sha256hex(payload);

    const std::string cr = canonicalRequest(
        method, uri, query, host,
        date8601, payloadHash);

    const std::string scope = std::format(
        "{}/{}/{}/aws4_request",
        date8, region, service);

    const std::string sts = std::format(
        "AWS4-HMAC-SHA256\n{}\n{}\n{}",
        date8601, scope, sha256hex(cr));

    const auto sk = signingKey(
        secretKey, date8, region, service);
    const auto sig = hexEncode(hmac256(sk, sts));

    return std::format(
        "AWS4-HMAC-SHA256 Credential={}/{},"
        "SignedHeaders=host;x-amz-content-sha256"
        ";x-amz-date,Signature={}",
        accessKey, scope, sig);
}

}  // namespace nextra::image::s3_signer
