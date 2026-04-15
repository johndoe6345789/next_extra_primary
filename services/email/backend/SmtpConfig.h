#pragma once
/**
 * @file SmtpConfig.h
 * @brief SMTP connection configuration read from env.
 *
 * Encapsulates all SMTP parameters so EmailService stays
 * focused on sending logic.
 */

#include <cstdint>
#include <cstdlib>
#include <string>

namespace services
{

/**
 * @struct SmtpConfig
 * @brief SMTP server connection parameters.
 */
struct SmtpConfig
{
    std::string host{"localhost"};
    std::uint16_t port{587};
    std::string user;
    std::string pass;
    std::string from{"noreply@nextra.app"};
    std::string baseUrl{"http://localhost:3000"};

    /**
     * @brief Load configuration from environment variables.
     *
     * Reads SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS,
     * SMTP_FROM, and APP_BASE_URL.
     *
     * @return SmtpConfig Populated configuration.
     */
    static SmtpConfig fromEnv()
    {
        auto env = [](const char* key,
                      const char* fallback) {
            const char* val = std::getenv(key);
            return std::string(val ? val : fallback);
        };

        SmtpConfig cfg;
        cfg.host = env("SMTP_HOST", "localhost");
        try {
            cfg.port = static_cast<std::uint16_t>(
                std::stoi(env("SMTP_PORT", "587")));
        } catch (const std::exception&) {
            cfg.port = 587;
        }
        cfg.user = env("SMTP_USER", "");
        cfg.pass = env("SMTP_PASS", "");
        cfg.from = env("SMTP_FROM", "noreply@nextra.app");
        cfg.baseUrl = env("APP_BASE_URL",
                          "http://localhost:3000");
        return cfg;
    }
};

} // namespace services
