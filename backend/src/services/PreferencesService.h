#pragma once
/**
 * @file PreferencesService.h
 * @brief Read/write user display preferences
 *        (theme_mode, preferred_locale).
 */

#include "services/gamification_types.h"

#include <string>

namespace services
{

/**
 * @class PreferencesService
 * @brief Persists per-user theme and locale
 *        preferences in the users table.
 */
class PreferencesService
{
  public:
    /**
     * @brief Fetch preferences for a user.
     * @param userId UUID of the user.
     * @param onOk JSON with theme_mode, locale.
     * @param onErr Error callback.
     */
    static void get(
        const std::string& userId,
        Callback onOk, ErrCallback onErr);

    /**
     * @brief Update one or both preferences.
     * @param userId UUID of the user.
     * @param themeMode "light", "dark", or "system".
     * @param locale Preferred locale code.
     * @param onOk JSON echo of saved values.
     * @param onErr Error callback.
     */
    static void update(
        const std::string& userId,
        const std::string& themeMode,
        const std::string& locale,
        Callback onOk, ErrCallback onErr);

  private:
    [[nodiscard]] static auto db() -> DbClientPtr;
};

} // namespace services
