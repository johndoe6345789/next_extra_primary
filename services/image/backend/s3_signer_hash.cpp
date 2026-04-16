/**
 * @file s3_signer_hash.cpp
 * @brief HMAC-SHA256 and SHA256 hex-digest helpers
 *        for AWS SigV4 signing.
 */

#include "image/backend/s3_signer.h"

#include <openssl/evp.h>
#include <openssl/hmac.h>
#include <openssl/sha.h>

#include <iomanip>
#include <sstream>
#include <stdexcept>

namespace nextra::image::s3_signer
{

std::vector<unsigned char> hmac256(
    const std::vector<unsigned char>& key,
    const std::string& msg)
{
    unsigned int len = 0;
    std::vector<unsigned char> out(EVP_MAX_MD_SIZE);
    if (!HMAC(
            EVP_sha256(),
            key.data(),
            static_cast<int>(key.size()),
            reinterpret_cast<const unsigned char*>(
                msg.data()),
            msg.size(),
            out.data(),
            &len))
    {
        throw std::runtime_error("HMAC-SHA256 failed");
    }
    out.resize(len);
    return out;
}

std::vector<unsigned char> hmac256(
    const std::string& key,
    const std::string& msg)
{
    std::vector<unsigned char> k(key.begin(), key.end());
    return hmac256(k, msg);
}

std::string sha256hex(const std::string& data)
{
    unsigned char digest[SHA256_DIGEST_LENGTH]{};
    SHA256(
        reinterpret_cast<const unsigned char*>(data.data()),
        data.size(),
        digest);
    std::ostringstream oss;
    for (auto b : digest)
    {
        oss << std::hex << std::setw(2)
            << std::setfill('0')
            << static_cast<int>(b);
    }
    return oss.str();
}

std::string hexEncode(
    const std::vector<unsigned char>& bytes)
{
    std::ostringstream oss;
    for (auto b : bytes)
    {
        oss << std::hex << std::setw(2)
            << std::setfill('0')
            << static_cast<int>(b);
    }
    return oss.str();
}

}  // namespace nextra::image::s3_signer
