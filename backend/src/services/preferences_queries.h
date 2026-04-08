#pragma once
/**
 * @file preferences_queries.h
 * @brief SQL queries and row-to-JSON helpers for
 *        PreferencesService.
 */

#include <drogon/orm/Result.h>
#include <nlohmann/json.hpp>

#include <string_view>

namespace services
{

using json = nlohmann::json;

/// @brief SQL to fetch user preferences.
constexpr std::string_view kPrefsGetSql =
    "SELECT theme_mode, preferred_locale "
    "FROM users WHERE id = $1";

/// @brief SQL to update user preferences.
constexpr std::string_view kPrefsUpdateSql =
    "UPDATE users "
    "SET theme_mode = $1, "
    "    preferred_locale = $2, "
    "    updated_at = NOW() "
    "WHERE id = $3 "
    "RETURNING theme_mode, preferred_locale";

/**
 * @brief Build preferences JSON from a DB row.
 * @param row  Database result row.
 * @return JSON with themeMode and locale.
 */
inline auto prefsFromRow(
    const drogon::orm::Row& row) -> json
{
    return {
        {"themeMode",
         row["theme_mode"].as<std::string>()},
        {"locale",
         row["preferred_locale"]
             .as<std::string>()},
    };
}

/**
 * @brief Default preferences when no row found.
 * @return JSON with system theme and en locale.
 */
inline auto defaultPrefs() -> json
{
    return {{"themeMode", "system"},
            {"locale", "en"}};
}

} // namespace services
