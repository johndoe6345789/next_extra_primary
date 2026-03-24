#pragma once
/**
 * @file PasswordHash.h
 * @brief Password hashing and verification utilities.
 *
 * @note Uses SHA-256 + random salt. For production, migrate
 *       to argon2id via libsodium or a similar library.
 */

#include <string>

namespace utils
{

/**
 * @brief Hash a plaintext password with a random salt.
 * @param plain  The raw password string.
 * @return String in the format "salt$hash" (hex-encoded).
 */
[[nodiscard]] auto hashPassword(const std::string& plain) -> std::string;

/**
 * @brief Verify a plaintext password against a stored hash.
 * @param plain  The raw password to check.
 * @param hash   The stored "salt$hash" string.
 * @return True if the password matches.
 */
[[nodiscard]] auto verifyPassword(const std::string& plain,
                                  const std::string& hash) -> bool;

} // namespace utils
