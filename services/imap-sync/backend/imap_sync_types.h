#pragma once
/**
 * @file imap_sync_types.h
 * @brief Types and callbacks for IMAP sync.
 */

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>

#include <functional>
#include <string>

namespace services
{

using json = nlohmann::json;
using SyncCb =
    std::function<void(json)>;
using SyncErrCb =
    std::function<void(
        drogon::HttpStatusCode, std::string)>;

/** @brief IMAP connection parameters. */
struct ImapConfig
{
    std::string host;
    int port{143};
    std::string user;
    std::string pass;
};

/** @brief Read IMAP config from environment. */
inline auto imapConfigFromEnv() -> ImapConfig
{
    auto env = [](const char* k,
                  const char* d) -> std::string {
        auto v = std::getenv(k);
        return v ? v : d;
    };
    return {
        env("DOVECOT_HOST", "mailserver"),
        std::stoi(env("DOVECOT_IMAP_PORT", "143")),
        env("IMAP_USER", ""),
        env("IMAP_PASS", ""),
    };
}

} // namespace services
