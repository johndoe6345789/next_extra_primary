/// @file EmailService.cpp -- Core SMTP sending.
#include "email/backend/EmailService.h"
#include "email/backend/email_template.h"

#include <mailio/message.hpp>
#include <mailio/smtp.hpp>
#include <spdlog/spdlog.h>

#include <string>

namespace services
{

EmailService::EmailService()
    : cfg_(SmtpConfig::fromEnv())
{
    loadTemplates();
    spdlog::info("EmailService configured: host={}, "
                 "port={}",
                 cfg_.host, cfg_.port);
}

void EmailService::loadTemplates()
{
    templates_ = loadEmailTemplates();
}

auto EmailService::renderTemplate(
    const std::string& templateHtml,
    const json& vars) const -> std::string
{
    return renderEmailTemplate(templateHtml, vars);
}

auto EmailService::sendEmail(
    const std::string& to,
    const std::string& subject,
    const std::string& htmlBody) -> bool
{
    try {
        mailio::message msg;
        msg.from(
            mailio::mail_address("Nextra", cfg_.from));
        msg.add_recipient(
            mailio::mail_address("", to));
        msg.subject(subject);
        msg.content_type(
            mailio::message::media_type_t::TEXT,
            "html", "utf-8");
        msg.content(htmlBody);

        mailio::smtp conn(cfg_.host, cfg_.port);
        conn.authenticate(
            cfg_.user, cfg_.pass,
            mailio::smtp::auth_method_t::LOGIN);
        conn.submit(msg);

        spdlog::info(
            "Email sent to {} [{}]", to, subject);
        return true;
    } catch (const mailio::smtp_error& e) {
        spdlog::error(
            "SMTP error to {}: {}", to, e.what());
    } catch (const mailio::dialog_error& e) {
        spdlog::error(
            "SMTP dialog error to {}: {}",
            to, e.what());
    } catch (const std::exception& e) {
        spdlog::error(
            "Email error to {}: {}", to, e.what());
    }
    return false;
}

} // namespace services
