/**
 * @file NotificationMutator.cpp
 * @brief Create and mark-as-read operations for notifications.
 */

#include "services/NotificationMutator.h"
#include "services/NotificationFormatter.h"

#include <drogon/orm/DbClient.h>
#include <spdlog/spdlog.h>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

auto NotificationMutator::db() -> DbClientPtr
{
    return drogon::app().getDbClient();
}

void NotificationMutator::createNotification(
    const std::string& userId, const std::string& title,
    const std::string& body, const std::string& type, const json& metadata,
    Callback onSuccess, ErrCallback onError)
{
    auto dbClient = db();
    const std::string sql = R"(
        INSERT INTO notifications
            (user_id, title, body, type,
             metadata, read, created_at)
        VALUES ($1, $2, $3, $4, $5, false, NOW())
        RETURNING id, user_id, title, body, type,
                  metadata, read, created_at
    )";

    *dbClient << sql << userId << title << body << type << metadata.dump() >>
        [onSuccess](const Result& result) {
            if (result.empty()) {
                onSuccess(json::object());
                return;
            }
            onSuccess(NotificationFormatter::rowToJson(result[0]));
        } >>
        [onError](const DrogonDbException& e) {
            spdlog::error("createNotification DB error: {}", e.base().what());
            onError(k500InternalServerError, "Internal server error");
        };
}

void NotificationMutator::markAsRead(const std::string& notificationId,
                                     const std::string& userId,
                                     Callback onSuccess, ErrCallback onError)
{
    auto dbClient = db();
    const std::string sql = R"(
        UPDATE notifications
        SET read = true
        WHERE id = $1 AND user_id = $2
        RETURNING id
    )";

    *dbClient << sql << notificationId << userId >> [onSuccess, onError](
                                                        const Result& result) {
        if (result.empty()) {
            onError(k404NotFound, "Notification not found");
            return;
        }
        onSuccess({{"read", true}});
    } >> [onError](const DrogonDbException& e) {
        spdlog::error("markAsRead DB error: {}", e.base().what());
        onError(k500InternalServerError, "Internal server error");
    };
}

} // namespace services
