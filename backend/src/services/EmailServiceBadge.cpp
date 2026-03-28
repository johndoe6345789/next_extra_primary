/// @file EmailServiceBadge.cpp -- Badge earned email.
#include "services/EmailService.h"

#include <fmt/format.h>
#include <spdlog/spdlog.h>

#include <chrono>
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

void EmailService::sendBadgeEarnedEmail(
    const std::string& email,
    const std::string& badgeName)
{
    std::thread([this, email, badgeName]() {
        try {
            auto tmpl = templates_.value(
                "badge_earned", json::object());
            json vars = {
                {"badge_name", badgeName},
                {"badge_description", ""},
                {"profile_url",
                 fmt::format("{}/profile", cfg_.baseUrl)},
                {"year", currentYear()}};

            sendEmail(
                email,
                renderTemplate(
                    tmpl.value("subject",
                               "You earned a new badge!"),
                    vars),
                renderTemplate(
                    tmpl.value("html", ""), vars));
        } catch (const std::exception& e) {
            spdlog::error("sendBadgeEarnedEmail: {}",
                          e.what());
        }
    }).detach();
}

} // namespace services
