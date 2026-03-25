/**
 * @file PasswordHash.cpp
 * @brief PBKDF2-SHA-256 password hashing implementation.
 *
 * Stored format: "<saltHex>$<iterations>$<dkHex>".
 * Uses 600 000 iterations (NIST SP 800-132) and CRYPTO_memcmp for
 * timing-safe verification.
 */

#include "PasswordHash.h"

#include <array>
#include <iomanip>
#include <openssl/crypto.h>
#include <openssl/evp.h>
#include <openssl/rand.h>
#include <sstream>
#include <stdexcept>

namespace utils
{
namespace
{
constexpr std::size_t kSaltBytes = 16;
constexpr std::size_t kDkBytes = 32;
constexpr int kIterations = 600'000;

auto toHex(const unsigned char* data, std::size_t len) -> std::string
{
    std::ostringstream oss;
    for (std::size_t i = 0; i < len; ++i) {
        oss << std::hex << std::setfill('0') << std::setw(2)
            << static_cast<int>(data[i]);
    }
    return oss.str();
}

auto fromHex(const std::string& hex, unsigned char* out,
             std::size_t maxLen) -> std::size_t
{
    std::size_t n = 0;
    for (std::size_t i = 0; i + 1 < hex.size() && n < maxLen; i += 2, ++n) {
        out[n] = static_cast<unsigned char>(
            std::stoi(hex.substr(i, 2), nullptr, 16));
    }
    return n;
}

auto pbkdf2(const std::string& plain, const unsigned char* salt,
            std::size_t saltLen, int iters) -> std::string
{
    std::array<unsigned char, kDkBytes> dk{};
    int rc =
        PKCS5_PBKDF2_HMAC(plain.data(), static_cast<int>(plain.size()), salt,
                          static_cast<int>(saltLen), iters, EVP_sha256(),
                          static_cast<int>(kDkBytes), dk.data());
    if (rc != 1) {
        throw std::runtime_error("PKCS5_PBKDF2_HMAC failed");
    }
    return toHex(dk.data(), kDkBytes);
}

} // namespace

auto hashPassword(const std::string& plain) -> std::string
{
    std::array<unsigned char, kSaltBytes> salt{};
    if (RAND_bytes(salt.data(), static_cast<int>(kSaltBytes)) != 1) {
        throw std::runtime_error("RAND_bytes failed");
    }
    auto saltHex = toHex(salt.data(), kSaltBytes);
    auto dkHex = pbkdf2(plain, salt.data(), kSaltBytes, kIterations);
    return saltHex + "$" + std::to_string(kIterations) + "$" + dkHex;
}

auto verifyPassword(const std::string& plain, const std::string& stored) -> bool
{
    auto p1 = stored.find('$');
    if (p1 == std::string::npos)
        return false;
    auto p2 = stored.find('$', p1 + 1);
    if (p2 == std::string::npos)
        return false;

    auto saltHex = stored.substr(0, p1);
    int iters = std::stoi(stored.substr(p1 + 1, p2 - p1 - 1));
    auto storedDk = stored.substr(p2 + 1);

    std::array<unsigned char, kSaltBytes> salt{};
    fromHex(saltHex, salt.data(), kSaltBytes);

    auto candidateDk = pbkdf2(plain, salt.data(), kSaltBytes, iters);

    // Timing-safe comparison prevents hash-timing side-channels.
    return CRYPTO_memcmp(candidateDk.data(), storedDk.data(),
                         candidateDk.size()) == 0;
}
} // namespace utils
