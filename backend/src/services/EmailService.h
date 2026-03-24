#pragma once
/**
 * @file EmailService.h
 * @brief SMTP email delivery service.
 *
 * Wraps the mailio library to send transactional emails
 * (welcome, password reset, badge earned, etc.).
 * Configuration is read from environment variables:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
 */

#include <nlohmann/json.hpp>

#include <cstdint>
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

    // -------------------------------------------------------
    // Generic
    // -------------------------------------------------------

    /**
     * @brief Send an arbitrary email.
     *
     * @param to       Recipient email address.
     * @param subject  Email subject line.
     * @param htmlBody HTML body content.
     * @return `true` if the message was accepted by the
     *         SMTP server.
     */
    [[nodiscard]] auto sendEmail(const std::string& to,
                                 const std::string& subject,
                                 const std::string& htmlBody) -> bool;

    // -------------------------------------------------------
    // Templated convenience methods
    // -------------------------------------------------------

    /**
     * @brief Send the welcome / email-confirmation email.
     *
     * @param email        Recipient address.
     * @param username     Display name for the greeting.
     * @param confirmToken URL-safe confirmation token.
     */
    void sendWelcomeEmail(const std::string& email, const std::string& username,
                          const std::string& confirmToken);

    /**
     * @brief Send a password-reset email.
     *
     * @param email      Recipient address.
     * @param resetToken URL-safe reset token.
     */
    void sendPasswordResetEmail(const std::string& email,
                                const std::string& resetToken);

    /**
     * @brief Notify the user of a newly earned badge.
     *
     * @param email     Recipient address.
     * @param badgeName Human-readable badge title.
     */
    void sendBadgeEarnedEmail(const std::string& email,
                              const std::string& badgeName);

  private:
    /// Load and cache email templates from JSON.
    void loadTemplates();

    /// Render an HTML template by replacing `{{key}}`
    /// placeholders with values from @p vars.
    [[nodiscard]] auto renderTemplate(const std::string& templateHtml,
                                      const json& vars) const -> std::string;

    /// Base URL for links embedded in emails (from env).
    std::string baseUrl_;

    /// SMTP connection parameters.
    std::string smtpHost_;
    std::uint16_t smtpPort_{587};
    std::string smtpUser_;
    std::string smtpPass_;
    std::string smtpFrom_;

    /// Cached email templates loaded from
    /// constants/email_templates.json.
    json templates_;
};

} // namespace services
