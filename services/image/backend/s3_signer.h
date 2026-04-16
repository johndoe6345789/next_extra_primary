#pragma once

/**
 * @file s3_signer.h
 * @brief AWS Signature Version 4 request signing.
 *
 * Generates the Authorization header for S3 PUT requests
 * using HMAC-SHA256 via OpenSSL EVP_MAC.
 */

#include <string>
#include <vector>

namespace nextra::image::s3_signer
{

/**
 * @brief Compute HMAC-SHA256 with a raw-bytes key.
 * @param key  Raw key bytes.
 * @param msg  Message to sign.
 * @return 32-byte HMAC digest.
 */
std::vector<unsigned char> hmac256(
    const std::vector<unsigned char>& key,
    const std::string& msg);

/**
 * @brief Compute HMAC-SHA256 with a string key.
 * @param key  Key as UTF-8 string.
 * @param msg  Message to sign.
 * @return 32-byte HMAC digest.
 */
std::vector<unsigned char> hmac256(
    const std::string& key,
    const std::string& msg);

/**
 * @brief Compute lowercase hex-encoded SHA256 of data.
 * @param data  Input string.
 * @return 64-char hex string.
 */
std::string sha256hex(const std::string& data);

/**
 * @brief Hex-encode a byte vector.
 * @param bytes  Input bytes.
 * @return Lowercase hex string.
 */
std::string hexEncode(
    const std::vector<unsigned char>& bytes);

/**
 * @brief Build an AWS SigV4 Authorization header value.
 *
 * @param method     HTTP verb (e.g. "PUT").
 * @param uri        Absolute URI path (e.g. "/bucket/key").
 * @param query      Query string (empty for plain PUT).
 * @param host       Host header value.
 * @param date8601   ISO-8601 date-time: "20240101T120000Z".
 * @param payload    Raw request body (bytes as string).
 * @param accessKey  AWS access key ID.
 * @param secretKey  AWS secret access key.
 * @param region     AWS region (e.g. "us-east-1").
 * @param service    AWS service name (e.g. "s3").
 * @return Full Authorization header value.
 */
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
    const std::string& service);

}  // namespace nextra::image::s3_signer
