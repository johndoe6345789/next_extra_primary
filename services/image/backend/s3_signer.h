#pragma once

/**
 * @file s3_signer.h
 * @brief Builds the Authorization header for AWS SigV4.
 */

#include <string>

namespace nextra::image::s3_signer
{

/**
 * @brief Build an AWS Signature Version 4 Authorization header.
 * @param method      HTTP method, e.g. "PUT".
 * @param bucket      S3 bucket name.
 * @param key         Object key path, e.g. "/variants/img.webp".
 * @param payloadHash sha256Hex of the request body.
 * @param accessKey   AWS access key ID.
 * @param secretKey   AWS secret access key.
 * @param region      AWS region, e.g. "us-east-1".
 * @param dateTimeISO Timestamp in "YYYYMMDDTHHmmSSZ" format.
 * @return Complete value for the Authorization HTTP header.
 */
std::string buildAuthHeader(
    const std::string& method,
    const std::string& bucket,
    const std::string& key,
    const std::string& payloadHash,
    const std::string& accessKey,
    const std::string& secretKey,
    const std::string& region,
    const std::string& dateTimeISO);

}  // namespace nextra::image::s3_signer
