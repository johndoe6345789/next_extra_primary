#pragma once

/**
 * @file HmacSigner.h
 * @brief HMAC-SHA256 signer for outbound webhook payloads.
 *
 * The canonical string signed is "<timestamp>.<body>" where the
 * timestamp is Unix seconds.  Receivers should reject anything
 * older than a few minutes to prevent replay attacks.  The returned
 * hex string is what goes into the X-Nextra-Signature header.
 */

#include <string>

namespace nextra::webhooks
{

/**
 * @brief Compute a hex-encoded HMAC-SHA256 signature.
 * @param secret The endpoint's shared secret.
 * @param timestamp Unix seconds serialised as decimal.
 * @param body Raw JSON body about to be POSTed.
 * @return Lowercase hex digest (64 chars), or empty on OpenSSL error.
 */
std::string signHmacSha256(const std::string& secret,
                           const std::string& timestamp,
                           const std::string& body);

}  // namespace nextra::webhooks
