#pragma once
/**
 * @file AuthService.h
 * @brief Thin coordinator that delegates to focused
 *        authentication sub-services.
 *
 * Keeps backward compatibility for callers that already
 * instantiate AuthService directly.
 */

#include "auth_service_types.h"
#include "email_confirm_service.h"
#include "password_reset_execute.h"
#include "password_reset_request.h"
#include "registration_service.h"
#include "session_service.h"
#include "token_refresh_service.h"
#include "token_service.h"

#include <functional>
#include <string>

namespace services
{

/**
 * @class AuthService
 * @brief Facade that delegates every operation to a
 *        single-responsibility sub-service.
 */
class AuthService
{
  public:
    AuthService() = default;
    ~AuthService() = default;

    /** @brief Register a new user. */
    void registerUser(
        const std::string& email,
        const std::string& username,
        const std::string& password,
        const std::string& displayName,
        Callback onSuccess, ErrCallback onError);

    /** @brief Authenticate with email + password. */
    void loginUser(
        const std::string& email,
        const std::string& password,
        Callback onSuccess, ErrCallback onError);

    /** @brief Refresh an expired access token. */
    void refreshAccessToken(
        const std::string& refreshToken,
        Callback onSuccess, ErrCallback onError);

    /** @brief Block a token JTI (logout). */
    void logoutUser(
        const std::string& jti,
        Callback onSuccess, ErrCallback onError);

    /** @brief Confirm email via one-time token. */
    void confirmEmail(
        const std::string& token,
        Callback onSuccess, ErrCallback onError);

    /** @brief Request a password-reset email. */
    void requestPasswordReset(
        const std::string& email,
        Callback onSuccess, ErrCallback onError);

    /** @brief Execute a password reset. */
    void resetPassword(
        const std::string& token,
        const std::string& newPassword,
        Callback onSuccess, ErrCallback onError);

    /** @brief Check if a JTI is blocklisted. */
    void isTokenBlocked(
        const std::string& jti,
        std::function<void(bool)> callback);

  private:
    RegistrationService registration_;
    SessionService session_;
    TokenRefreshService tokenRefresh_;
    TokenService token_;
    EmailConfirmService emailConfirm_;
    PasswordResetRequest pwResetReq_;
    PasswordResetExecute pwResetExec_;
};

} // namespace services
