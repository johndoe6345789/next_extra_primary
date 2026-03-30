#pragma once
/**
 * @file EmailService.h
 * @brief SMTP email delivery service.
 *
 * Wraps the mailio library to send transactional emails
 * (welcome, password reset, badge earned, etc.).
 */

#include "services/SmtpConfig.h"

#include <nlohmann/json.hpp>

#include <string>

namespace services
{

using json = nlohmann::json;

/**
 * @class EmailService
 * @brief Sends transactional emails via SMTP.
 *
 * All heavy I/O is performed on background threads so the
 * Drogon event loop is never blocked.
 */
class EmailService
{
  public:
    EmailService();
    ~EmailService() = default;

    /**
     * @brief Send an arbitrary email.
     *
     * @param to       Recipient email address.
     * @param subject  Email subject line.
     * @param htmlBody HTML body content.
     * @return `true` if the SMTP server accepted it.
     */
    [[nodiscard]] auto sendEmail(
        const std::string& to,
        const std::string& subject,
        const std::string& htmlBody) -> bool;

    /// @brief Send welcome / email-confirmation email.
    void sendWelcomeEmail(const std::string& email,
                          const std::string& username,
                          const std::string& confirmToken);

    /// @brief Send a password-reset email.
    void sendPasswordResetEmail(
        const std::string& email,
        const std::string& resetToken);

    /// @brief Notify user of a newly earned badge.
    void sendBadgeEarnedEmail(
        const std::string& email,
        const std::string& badgeName);

  private:
    void loadTemplates();

    /// Render `{{key}}` placeholders with values from vars.
    [[nodiscard]] auto renderTemplate(
        const std::string& templateHtml,
        const json& vars) const -> std::string;

    SmtpConfig cfg_;
    json templates_;
};

} // namespace services
