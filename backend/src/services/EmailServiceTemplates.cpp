/**
 * @file EmailServiceTemplates.cpp
 * @brief Templated email convenience methods.
 *
 * Each method runs on a detached thread so the Drogon
 * event loop is never blocked by SMTP I/O.
 */

#include "services/EmailService.h"

#include <fmt/format.h>
#include <spdlog/spdlog.h>

#include <chrono>
#include <string>
#include <thread>

namespace services
{

/// @brief Get the current calendar year.
static int currentYear()
{
    auto now = std::chrono::system_clock::now();
    auto dp = std::chrono::floor<std::chrono::days>(now);
    std::chrono::year_month_day ymd{dp};
    return static_cast<int>(ymd.year());
}

void EmailService::sendWelcomeEmail(
    const std::string& email,
    const std::string& username,
    const std::string& confirmToken)
{
    std::thread([this, email, username, confirmToken]() {
        try {
            auto tmpl = templates_.value(
                "welcome", json::object());
            json vars = {
                {"username", username},
                {"confirm_url",
                 fmt::format("{}/auth/confirm?token={}",
                             cfg_.baseUrl, confirmToken)},
                {"year", currentYear()}};

            sendEmail(email,
                      renderTemplate(
                          tmpl.value("subject",
                                     "Welcome to Nextra!"),
                          vars),
                      renderTemplate(
                          tmpl.value("html", ""), vars));
        } catch (const std::exception& e) {
            spdlog::error("sendWelcomeEmail: {}", e.what());
        }
    }).detach();
}

void EmailService::sendPasswordResetEmail(
    const std::string& email,
    const std::string& resetToken)
{
    std::thread([this, email, resetToken]() {
        try {
            auto tmpl = templates_.value(
                "password_reset", json::object());
            json vars = {
                {"reset_url",
                 fmt::format("{}/auth/reset-password"
                             "?token={}",
                             cfg_.baseUrl, resetToken)},
                {"year", currentYear()}};

            sendEmail(
                email,
                renderTemplate(
                    tmpl.value("subject",
                               "Reset Your Nextra Password"),
                    vars),
                renderTemplate(
                    tmpl.value("html", ""), vars));
        } catch (const std::exception& e) {
            spdlog::error("sendPasswordResetEmail: {}",
                          e.what());
        }
    }).detach();
}

} // namespace services
