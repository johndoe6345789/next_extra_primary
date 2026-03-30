/// @file EmailService.cpp -- Core SMTP sending / loading.
#include "services/EmailService.h"

#include <fmt/format.h>
#include <mailio/message.hpp>
#include <mailio/smtp.hpp>
#include <spdlog/spdlog.h>

#include <fstream>
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
    try {
        std::ifstream ifs(
            "src/constants/email-templates.json");
        if (!ifs.is_open()) {
            ifs.open("backend/src/constants/"
                     "email-templates.json");
        }
        if (ifs.is_open()) {
            templates_ = json::parse(ifs);
            spdlog::info("Loaded {} email template(s)",
                         templates_.size());
        } else {
            spdlog::warn("email-templates.json not found");
        }
    } catch (const std::exception& e) {
        spdlog::error("Failed to load email templates: {}",
                      e.what());
    }
}

auto EmailService::renderTemplate(
    const std::string& templateHtml,
    const json& vars) const -> std::string
{
    std::string result = templateHtml;
    for (auto& [key, value] : vars.items()) {
        std::string ph = fmt::format("{{{{{}}}}}", key);
        std::string rep = value.is_string()
                              ? value.get<std::string>()
                              : value.dump();
        std::string::size_type pos = 0;
        while ((pos = result.find(ph, pos)) !=
               std::string::npos) {
            result.replace(pos, ph.size(), rep);
            pos += rep.size();
        }
    }
    return result;
}

auto EmailService::sendEmail(
    const std::string& to,
    const std::string& subject,
    const std::string& htmlBody) -> bool
{
    try {
        mailio::message msg;
        msg.from(mailio::mail_address("Nextra", cfg_.from));
        msg.add_recipient(mailio::mail_address("", to));
        msg.subject(subject);
        msg.content_type(mailio::message::media_type_t::TEXT,
                         "html", "utf-8");
        msg.content(htmlBody);

        mailio::smtps conn(cfg_.host, cfg_.port);
        conn.authenticate(
            cfg_.user, cfg_.pass,
            mailio::smtps::auth_method_t::LOGIN);
        conn.submit(msg);

        spdlog::info("Email sent to {} [{}]", to, subject);
        return true;
    } catch (const mailio::smtp_error& e) {
        spdlog::error("SMTP error to {}: {}", to, e.what());
    } catch (const mailio::dialog_error& e) {
        spdlog::error("SMTP dialog error to {}: {}",
                      to, e.what());
    } catch (const std::exception& e) {
        spdlog::error("Email error to {}: {}", to, e.what());
    }
    return false;
}

} // namespace services
