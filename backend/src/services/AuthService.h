#pragma once
/**
 * @file AuthService.h
 * @brief Authentication and authorisation service.
 *
 * Handles user registration, login / logout, JWT lifecycle,
 * email confirmation, and password-reset flows.
 */

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>

#include <functional>
#include <optional>
#include <string>

namespace services {

using json = nlohmann::json;
using DbClientPtr = drogon::orm::DbClientPtr;
using Callback = std::function<void(json /*result*/)>;
using ErrCallback =
    std::function<void(drogon::HttpStatusCode, std::string)>;

/**
 * @class AuthService
 * @brief Stateless service for authentication operations.
 *
 * Every public method follows the async-callback pattern so
 * it can be invoked from Drogon controller handlers without
 * blocking the event loop.
 */
class AuthService {
public:
    AuthService() = default;
    ~AuthService() = default;

    // -------------------------------------------------------
    // Registration
    // -------------------------------------------------------

    /**
     * @brief Register a new user account.
     *
     * Validates input, hashes the password, persists the user
     * row, and dispatches a confirmation email.
     *
     * @param email       User email (must be unique).
     * @param username    Desired username (3-30 alnum chars).
     * @param password    Plain-text password (>=8 chars).
     * @param displayName Optional display name.
     * @param onSuccess   Callback with the created user JSON.
     * @param onError     Callback on validation / DB error.
     */
    void registerUser(
        const std::string &email,
        const std::string &username,
        const std::string &password,
        const std::string &displayName,
        Callback onSuccess,
        ErrCallback onError);

    // -------------------------------------------------------
    // Login / Logout
    // -------------------------------------------------------

    /**
     * @brief Authenticate with email + password.
     *
     * On success the callback receives a JSON object with
     * `accessToken`, `refreshToken`, and `user`.
     *
     * @param email     Registered email address.
     * @param password  Plain-text password to verify.
     * @param onSuccess Callback with auth payload.
     * @param onError   Callback on bad credentials / error.
     */
    void loginUser(
        const std::string &email,
        const std::string &password,
        Callback onSuccess,
        ErrCallback onError);

    /**
     * @brief Refresh an expired access token.
     *
     * @param refreshToken A valid, non-blocked refresh JWT.
     * @param onSuccess    Callback with `{accessToken}`.
     * @param onError      Callback on invalid / blocked token.
     */
    void refreshAccessToken(
        const std::string &refreshToken,
        Callback onSuccess,
        ErrCallback onError);

    /**
     * @brief Log the user out by blocking the token's JTI.
     *
     * @param jti       The JWT ID claim to block.
     * @param onSuccess Callback on success (empty JSON).
     * @param onError   Callback on failure.
     */
    void logoutUser(
        const std::string &jti,
        Callback onSuccess,
        ErrCallback onError);

    // -------------------------------------------------------
    // Email confirmation
    // -------------------------------------------------------

    /**
     * @brief Confirm a user's email via a one-time token.
     *
     * @param token     Confirmation token from the email link.
     * @param onSuccess Callback with `{confirmed: true}`.
     * @param onError   Callback on invalid / expired token.
     */
    void confirmEmail(
        const std::string &token,
        Callback onSuccess,
        ErrCallback onError);

    // -------------------------------------------------------
    // Password reset
    // -------------------------------------------------------

    /**
     * @brief Request a password-reset email.
     *
     * Always returns success to avoid leaking whether the
     * email exists. A reset token is generated and emailed
     * when the account is found.
     *
     * @param email     Email address to send the reset to.
     * @param onSuccess Callback (always fires).
     * @param onError   Callback on internal error only.
     */
    void requestPasswordReset(
        const std::string &email,
        Callback onSuccess,
        ErrCallback onError);

    /**
     * @brief Reset password using a valid reset token.
     *
     * @param token       One-time reset token.
     * @param newPassword New plain-text password.
     * @param onSuccess   Callback with `{reset: true}`.
     * @param onError     Callback on invalid / expired token.
     */
    void resetPassword(
        const std::string &token,
        const std::string &newPassword,
        Callback onSuccess,
        ErrCallback onError);

    // -------------------------------------------------------
    // Token blocklist
    // -------------------------------------------------------

    /**
     * @brief Check whether a JTI has been blocklisted.
     *
     * @param jti       The JWT ID to check.
     * @param callback  Receives `true` if blocked.
     */
    void isTokenBlocked(
        const std::string &jti,
        std::function<void(bool)> callback);

private:
    /// Convenience accessor for the default DB client.
    [[nodiscard]] static auto db() -> DbClientPtr;

    /// Validate email format with a simple regex.
    [[nodiscard]] static auto isValidEmail(
        const std::string &email) -> bool;

    /// Validate username (3-30 alphanumeric / underscore).
    [[nodiscard]] static auto isValidUsername(
        const std::string &username) -> bool;

    /// Validate password strength.
    [[nodiscard]] static auto isStrongPassword(
        const std::string &password) -> bool;

    /// Generate a cryptographically random hex token.
    [[nodiscard]] static auto generateRandomToken(
        std::size_t bytes = 32) -> std::string;
};

}  // namespace services
