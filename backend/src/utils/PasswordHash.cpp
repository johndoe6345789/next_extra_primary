/**
 * @file PasswordHash.cpp
 * @brief SHA-256 + salt password hashing implementation.
 *
 * @warning For production use argon2id. This implementation is
 *          a placeholder that is NOT timing-attack resistant.
 */

#include "PasswordHash.h"

#include <openssl/evp.h>
#include <openssl/rand.h>
#include <array>
#include <iomanip>
#include <sstream>
#include <stdexcept>

namespace utils {

namespace {

constexpr std::size_t kSaltBytes = 16;
constexpr std::size_t kHashBytes = 32;  // SHA-256

auto toHex(const unsigned char *data,
           std::size_t len) -> std::string
{
    std::ostringstream oss;
    for (std::size_t i = 0; i < len; ++i) {
        oss << std::hex << std::setfill('0')
            << std::setw(2)
            << static_cast<int>(data[i]);
    }
    return oss.str();
}

auto fromHex(const std::string &hex,
             unsigned char *out,
             std::size_t maxLen) -> std::size_t
{
    std::size_t count = 0;
    for (std::size_t i = 0;
         i + 1 < hex.size() && count < maxLen;
         i += 2, ++count)
    {
        out[count] = static_cast<unsigned char>(
            std::stoi(hex.substr(i, 2), nullptr, 16));
    }
    return count;
}

auto sha256(const std::string &input) -> std::string
{
    std::array<unsigned char, kHashBytes> digest{};
    unsigned int len = 0;

    EVP_MD_CTX *ctx = EVP_MD_CTX_new();
    if (!ctx) {
        throw std::runtime_error("EVP_MD_CTX_new failed");
    }
    EVP_DigestInit_ex(ctx, EVP_sha256(), nullptr);
    EVP_DigestUpdate(
        ctx, input.data(), input.size());
    EVP_DigestFinal_ex(ctx, digest.data(), &len);
    EVP_MD_CTX_free(ctx);

    return toHex(digest.data(), len);
}

}  // namespace

auto hashPassword(const std::string &plain) -> std::string
{
    std::array<unsigned char, kSaltBytes> salt{};
    if (RAND_bytes(salt.data(), kSaltBytes) != 1) {
        throw std::runtime_error("RAND_bytes failed");
    }
    auto saltHex = toHex(salt.data(), kSaltBytes);
    auto hash    = sha256(saltHex + plain);
    return saltHex + "$" + hash;
}

auto verifyPassword(
    const std::string &plain,
    const std::string &stored) -> bool
{
    auto pos = stored.find('$');
    if (pos == std::string::npos) {
        return false;
    }
    auto saltHex   = stored.substr(0, pos);
    auto expected   = stored.substr(pos + 1);
    auto candidate  = sha256(saltHex + plain);
    return candidate == expected;
}

}  // namespace utils
