/**
 * @file NotificationDeleter.cpp
 * @brief Bulk-mark and delete operations for notifications.
 */

#include "services/NotificationDeleter.h"

#include <drogon/orm/DbClient.h>
#include <spdlog/spdlog.h>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

auto NotificationDeleter::db() -> DbClientPtr
{
    return drogon::app().getDbClient();
}

void NotificationDeleter::markAllAsRead(
    const std::string& userId,
    Callback onSuccess, ErrCallback onError)
{
    auto dbClient = db();
    const std::string sql = R"(
        WITH updated AS (
            UPDATE notifications
            SET read = true
            WHERE user_id = $1 AND read = false
            RETURNING id
        )
        SELECT COUNT(*) AS count FROM updated
    )";

    *dbClient << sql << userId >>
        [onSuccess](const Result& result) {
            std::int64_t count = 0;
            if (!result.empty()) {
                count = result[0]["count"]
                            .as<std::int64_t>();
            }
            onSuccess({{"count", count}});
        } >>
        [onError](const DrogonDbException& e) {
            spdlog::error("markAllAsRead DB error: {}",
                          e.base().what());
            onError(k500InternalServerError,
                    "Internal server error");
        };
}

void NotificationDeleter::deleteNotification(
    const std::string& notificationId,
    const std::string& userId,
    Callback onSuccess, ErrCallback onError)
{
    auto dbClient = db();
    const std::string sql = R"(
        DELETE FROM notifications
        WHERE id = $1 AND user_id = $2
        RETURNING id
    )";

    *dbClient << sql << notificationId << userId >>
        [onSuccess, onError](const Result& result) {
            if (result.empty()) {
                onError(k404NotFound,
                        "Notification not found");
                return;
            }
            onSuccess({{"deleted", true}});
        } >>
        [onError](const DrogonDbException& e) {
            spdlog::error(
                "deleteNotification DB error: {}",
                e.base().what());
            onError(k500InternalServerError,
                    "Internal server error");
        };
}

} // namespace services
