#pragma once
/**
 * @file NotificationFormatter.h
 * @brief Row-to-JSON conversion helpers for notifications.
 */

#include <drogon/orm/Result.h>
#include <nlohmann/json.hpp>

namespace services
{

using json = nlohmann::json;

/**
 * @class NotificationFormatter
 * @brief Converts raw DB result rows into notification JSON objects.
 */
class NotificationFormatter
{
  public:
    /**
     * @brief Build a notification JSON object from a single DB row.
     *
     * Parses the metadata column back to a JSON value; falls back to
     * an empty object on parse failure.
     *
     * @param r  A single row from the notifications table.
     * @return   JSON object with camelCase notification fields.
     */
    [[nodiscard]] static auto rowToJson(const drogon::orm::Row& r) -> json;
};

} // namespace services
