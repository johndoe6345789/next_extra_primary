/**
 * @file PreferencesService.cpp
 * @brief Read/write user theme and locale prefs.
 */

#include "services/PreferencesService.h"

#include <drogon/drogon.h>
#include <spdlog/spdlog.h>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

auto PreferencesService::db() -> DbClientPtr
{
    return drogon::app().getDbClient();
}

void PreferencesService::get(
    const std::string& userId,
    Callback onOk, ErrCallback onErr)
{
    const std::string sql =
        "SELECT theme_mode, preferred_locale "
        "FROM users WHERE id = $1";

    *db() << sql << userId
        >> [onOk](const Result& r) {
            if (r.empty()) {
                onOk({{"themeMode", "system"},
                      {"locale", "en"}});
                return;
            }
            const auto& row = r[0];
            onOk({
                {"themeMode",
                 row["theme_mode"]
                     .as<std::string>()},
                {"locale",
                 row["preferred_locale"]
                     .as<std::string>()},
            });
        }
        >> [onErr](const DrogonDbException& e) {
            spdlog::error(
                "PreferencesService::get: {}",
                e.base().what());
            onErr(k500InternalServerError,
                  "Internal server error");
        };
}

void PreferencesService::update(
    const std::string& userId,
    const std::string& themeMode,
    const std::string& locale,
    Callback onOk, ErrCallback onErr)
{
    const std::string sql =
        "UPDATE users "
        "SET theme_mode = $1, "
        "    preferred_locale = $2, "
        "    updated_at = NOW() "
        "WHERE id = $3 "
        "RETURNING theme_mode, preferred_locale";

    *db() << sql << themeMode << locale << userId
        >> [onOk](const Result& r) {
            if (r.empty()) {
                onOk({{"themeMode", "system"},
                      {"locale", "en"}});
                return;
            }
            const auto& row = r[0];
            onOk({
                {"themeMode",
                 row["theme_mode"]
                     .as<std::string>()},
                {"locale",
                 row["preferred_locale"]
                     .as<std::string>()},
            });
        }
        >> [onErr](const DrogonDbException& e) {
            spdlog::error(
                "PreferencesService::update: {}",
                e.base().what());
            onErr(k500InternalServerError,
                  "Internal server error");
        };
}

} // namespace services
