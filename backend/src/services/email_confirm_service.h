#pragma once
/**
 * @file email_confirm_service.h
 * @brief Email confirmation via one-time token.
 */

#include "auth_service_types.h"

#include <string>

namespace services
{

/**
 * @class EmailConfirmService
 * @brief Confirms a user's email address using a token.
 */
class EmailConfirmService
{
  public:
    EmailConfirmService() = default;
    ~EmailConfirmService() = default;

    /**
     * @brief Confirm a user's email via a one-time token.
     * @param token     Confirmation token from the email.
     * @param onSuccess Callback with `{confirmed: true}`.
     * @param onError   Callback on invalid/expired token.
     */
    void confirmEmail(
        const std::string& token,
        Callback onSuccess,
        ErrCallback onError);
};

} // namespace services
