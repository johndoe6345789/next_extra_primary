/**
 * @file EmailService.cpp
 * @brief SMTP email delivery implementation using mailio.
 */

#include "services/EmailService.h"

#include <fmt/format.h>
#include <mailio/message.hpp>
#include <mailio/smtp.hpp>
#include <spdlog/spdlog.h>

#include <chrono>
#include <cstdlib>
#include <fstream>
#include <regex>
#include <stdexcept>
#include <string>
#include <thread>

namespace services
{

// ----------------------------------------------------------------
// Construction / configuration
// ----------------------------------------------------------------

EmailService::EmailService()
{
    auto env = [](const char* key, const char* fallback) -> std::string {
        const char* val = std::getenv(key);
        return val ? val : fallback;
    };

    smtpHost_ = env("SMTP_HOST", "localhost");
    smtpPort_ = static_cast<std::uint16_t>(std::stoi(env("SMTP_PORT", "587")));
    smtpUser_ = env("SMTP_USER", "");
    smtpPass_ = env("SMTP_PASS", "");
    smtpFrom_ = env("SMTP_FROM", "noreply@nextra.app");
    baseUrl_ = env("APP_BASE_URL", "http://localhost:3000");

    loadTemplates();

    spdlog::info("EmailService configured: host={}, port={}", smtpHost_,
                 smtpPort_);
}

void EmailService::loadTemplates()
{
    try {
        std::ifstream ifs("src/constants/email_templates.json");
        if (!ifs.is_open()) {
            // Try an alternate relative path when the
            // working directory is the project root.
            ifs.open("backend/src/constants/"
                     "email_templates.json");
        }
        if (ifs.is_open()) {
            templates_ = json::parse(ifs);
            spdlog::info("Loaded {} email template(s)", templates_.size());
        } else {
            spdlog::warn("email_templates.json not found; "
                         "templates will be empty");
        }
    } catch (const std::exception& e) {
        spdlog::error("Failed to load email templates: {}", e.what());
    }
}

// ----------------------------------------------------------------
// Template rendering
// ----------------------------------------------------------------

auto EmailService::renderTemplate(const std::string& templateHtml,
                                  const json& vars) const -> std::string
{
    std::string result = templateHtml;
    for (auto& [key, value] : vars.items()) {
        std::string placeholder = fmt::format("{{{{{}}}}}", key);
        std::string replacement =
            value.is_string() ? value.get<std::string>() : value.dump();
        std::string::size_type pos = 0;
        while ((pos = result.find(placeholder, pos)) != std::string::npos) {
            result.replace(pos, placeholder.size(), replacement);
            pos += replacement.size();
        }
    }
    return result;
}

// ----------------------------------------------------------------
// Generic send
// ----------------------------------------------------------------

auto EmailService::sendEmail(const std::string& to, const std::string& subject,
                             const std::string& htmlBody) -> bool
{
    try {
        mailio::message msg;
        msg.from(mailio::mail_address("Nextra", smtpFrom_));
        msg.add_recipient(mailio::mail_address("", to));
        msg.subject(subject);
        msg.content_type(mailio::message::media_type_t::TEXT, "html", "utf-8");
        msg.content(htmlBody);

        mailio::smtps conn(smtpHost_, smtpPort_);
        conn.authenticate(smtpUser_, smtpPass_,
                          mailio::smtps::auth_method_t::LOGIN);
        conn.submit(msg);

        spdlog::info("Email sent to {} [{}]", to, subject);
        return true;
    } catch (const mailio::smtp_error& e) {
        spdlog::error("SMTP error sending to {}: {}", to, e.what());
        return false;
    } catch (const mailio::dialog_error& e) {
        spdlog::error("SMTP dialog error sending to {}: {}", to, e.what());
        return false;
    } catch (const std::exception& e) {
        spdlog::error("Unexpected error sending email to {}: {}", to, e.what());
        return false;
    }
}

// ----------------------------------------------------------------
// Templated convenience methods
// ----------------------------------------------------------------

void EmailService::sendWelcomeEmail(const std::string& email,
                                    const std::string& username,
                                    const std::string& confirmToken)
{
    // Run on a detached thread so the caller is not
    // blocked by SMTP I/O.
    std::thread([this, email, username, confirmToken]() {
        try {
            auto tmpl = templates_.value("welcome", json::object());
            auto subjectTmpl = tmpl.value("subject", "Welcome to Nextra!");
            auto htmlTmpl = tmpl.value("html", "");

            auto now = std::chrono::system_clock::now();
            auto tt = std::chrono::system_clock::to_time_t(now);
            std::tm tm{};
            gmtime_r(&tt, &tm);

            json vars = {{"username", username},
                         {"confirm_url", fmt::format("{}/auth/confirm?token={}",
                                                     baseUrl_, confirmToken)},
                         {"year", 1900 + tm.tm_year}};

            auto subject = renderTemplate(subjectTmpl, vars);
            auto html = renderTemplate(htmlTmpl, vars);

            sendEmail(email, subject, html);
        } catch (const std::exception& e) {
            spdlog::error("sendWelcomeEmail error: {}", e.what());
        }
    }).detach();
}

void EmailService::sendPasswordResetEmail(const std::string& email,
                                          const std::string& resetToken)
{
    std::thread([this, email, resetToken]() {
        try {
            auto tmpl = templates_.value("password_reset", json::object());
            auto subjectTmpl =
                tmpl.value("subject", "Reset Your Nextra Password");
            auto htmlTmpl = tmpl.value("html", "");

            auto now = std::chrono::system_clock::now();
            auto tt = std::chrono::system_clock::to_time_t(now);
            std::tm tm{};
            gmtime_r(&tt, &tm);

            json vars = {{"reset_url", fmt::format("{}/auth/reset-password"
                                                   "?token={}",
                                                   baseUrl_, resetToken)},
                         {"year", 1900 + tm.tm_year}};

            auto subject = renderTemplate(subjectTmpl, vars);
            auto html = renderTemplate(htmlTmpl, vars);

            sendEmail(email, subject, html);
        } catch (const std::exception& e) {
            spdlog::error("sendPasswordResetEmail error: {}", e.what());
        }
    }).detach();
}

void EmailService::sendBadgeEarnedEmail(const std::string& email,
                                        const std::string& badgeName)
{
    std::thread([this, email, badgeName]() {
        try {
            auto tmpl = templates_.value("badge_earned", json::object());
            auto subjectTmpl = tmpl.value("subject", "You earned a new badge!");
            auto htmlTmpl = tmpl.value("html", "");

            auto now = std::chrono::system_clock::now();
            auto tt = std::chrono::system_clock::to_time_t(now);
            std::tm tm{};
            gmtime_r(&tt, &tm);

            json vars = {{"badge_name", badgeName},
                         {"badge_description", ""},
                         {"profile_url", fmt::format("{}/profile", baseUrl_)},
                         {"year", 1900 + tm.tm_year}};

            auto subject = renderTemplate(subjectTmpl, vars);
            auto html = renderTemplate(htmlTmpl, vars);

            sendEmail(email, subject, html);
        } catch (const std::exception& e) {
            spdlog::error("sendBadgeEarnedEmail error: {}", e.what());
        }
    }).detach();
}

} // namespace services
