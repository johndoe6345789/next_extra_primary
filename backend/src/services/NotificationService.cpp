/**
 * @file NotificationService.cpp
 * @brief Implementation of in-app notifications.
 */

#include "services/NotificationService.h"

#include <drogon/drogon.h>
#include <drogon/orm/DbClient.h>
#include <spdlog/spdlog.h>
#include <fmt/format.h>

#include <string>

namespace services {

using namespace drogon;
using namespace drogon::orm;

auto NotificationService::db() -> DbClientPtr
{
    return drogon::app().getDbClient();
}

// ----------------------------------------------------------------
// createNotification
// ----------------------------------------------------------------

void NotificationService::createNotification(
    const std::string &userId,
    const std::string &title,
    const std::string &body,
    const std::string &type,
    const json &metadata,
    Callback onSuccess,
    ErrCallback onError)
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

    *dbClient << sql
        << userId << title << body << type
        << metadata.dump()
        >> [onSuccess](const Result &result) {
            if (result.empty()) {
                onSuccess(json::object());
                return;
            }
            const auto &r = result[0];
            json notif = {
                {"id", r["id"].as<std::string>()},
                {"userId",
                 r["user_id"].as<std::string>()},
                {"title",
                 r["title"].as<std::string>()},
                {"body",
                 r["body"].as<std::string>()},
                {"type",
                 r["type"].as<std::string>()},
                {"read", false},
                {"createdAt",
                 r["created_at"]
                     .as<std::string>()}
            };
            // Parse metadata back to JSON.
            try {
                notif["metadata"] = json::parse(
                    r["metadata"].as<std::string>());
            } catch (...) {
                notif["metadata"] = json::object();
            }
            onSuccess(notif);
        }
        >> [onError](const DrogonDbException &e) {
            spdlog::error(
                "createNotification DB error: {}",
                e.base().what());
            onError(k500InternalServerError,
                    "Internal server error");
        };
}

// ----------------------------------------------------------------
// getNotifications
// ----------------------------------------------------------------

void NotificationService::getNotifications(
    const std::string &userId,
    std::int32_t page,
    std::int32_t perPage,
    Callback onSuccess,
    ErrCallback onError)
{
    if (page < 1) page = 1;
    if (perPage < 1) perPage = 20;
    if (perPage > 100) perPage = 100;

    auto dbClient = db();
    auto offset =
        static_cast<std::int64_t>(page - 1) * perPage;

    // Count total first.
    const std::string countSql = R"(
        SELECT COUNT(*) AS total
        FROM notifications
        WHERE user_id = $1
    )";

    *dbClient << countSql << userId
        >> [dbClient, userId, page, perPage, offset,
            onSuccess, onError](
               const Result &countResult) {
            std::int64_t total = 0;
            if (!countResult.empty()) {
                total = countResult[0]["total"]
                            .as<std::int64_t>();
            }

            const std::string dataSql = R"(
                SELECT id, user_id, title, body, type,
                       metadata, read, created_at
                FROM notifications
                WHERE user_id = $1
                ORDER BY created_at DESC
                LIMIT $2 OFFSET $3
            )";

            *dbClient << dataSql
                << userId << perPage << offset
                >> [total, page, perPage, onSuccess](
                       const Result &result) {
                    json items = json::array();
                    for (const auto &r : result) {
                        json n = {
                            {"id",
                             r["id"]
                                 .as<std::string>()},
                            {"userId",
                             r["user_id"]
                                 .as<std::string>()},
                            {"title",
                             r["title"]
                                 .as<std::string>()},
                            {"body",
                             r["body"]
                                 .as<std::string>()},
                            {"type",
                             r["type"]
                                 .as<std::string>()},
                            {"read",
                             r["read"].as<bool>()},
                            {"createdAt",
                             r["created_at"]
                                 .as<std::string>()}
                        };
                        try {
                            n["metadata"] =
                                json::parse(
                                    r["metadata"]
                                        .as<std::string>());
                        } catch (...) {
                            n["metadata"] =
                                json::object();
                        }
                        items.push_back(n);
                    }

                    std::int64_t totalPages =
                        (total + perPage - 1)
                        / perPage;
                    onSuccess({
                        {"data", items},
                        {"pagination",
                         {{"total", total},
                          {"page", page},
                          {"perPage", perPage},
                          {"totalPages",
                           totalPages}}}
                    });
                }
                >> [onError](
                       const DrogonDbException &e) {
                    spdlog::error(
                        "getNotifications data "
                        "DB error: {}",
                        e.base().what());
                    onError(
                        k500InternalServerError,
                        "Internal server error");
                };
        }
        >> [onError](const DrogonDbException &e) {
            spdlog::error(
                "getNotifications count "
                "DB error: {}",
                e.base().what());
            onError(k500InternalServerError,
                    "Internal server error");
        };
}

// ----------------------------------------------------------------
// getUnreadCount
// ----------------------------------------------------------------

void NotificationService::getUnreadCount(
    const std::string &userId,
    Callback onSuccess,
    ErrCallback onError)
{
    auto dbClient = db();
    const std::string sql = R"(
        SELECT COUNT(*) AS count
        FROM notifications
        WHERE user_id = $1 AND read = false
    )";

    *dbClient << sql << userId
        >> [onSuccess](const Result &result) {
            std::int64_t count = 0;
            if (!result.empty()) {
                count = result[0]["count"]
                            .as<std::int64_t>();
            }
            onSuccess({{"count", count}});
        }
        >> [onError](const DrogonDbException &e) {
            spdlog::error(
                "getUnreadCount DB error: {}",
                e.base().what());
            onError(k500InternalServerError,
                    "Internal server error");
        };
}

// ----------------------------------------------------------------
// markAsRead
// ----------------------------------------------------------------

void NotificationService::markAsRead(
    const std::string &notificationId,
    const std::string &userId,
    Callback onSuccess,
    ErrCallback onError)
{
    auto dbClient = db();
    const std::string sql = R"(
        UPDATE notifications
        SET read = true
        WHERE id = $1 AND user_id = $2
        RETURNING id
    )";

    *dbClient << sql << notificationId << userId
        >> [onSuccess, onError](
               const Result &result) {
            if (result.empty()) {
                onError(k404NotFound,
                        "Notification not found");
                return;
            }
            onSuccess({{"read", true}});
        }
        >> [onError](const DrogonDbException &e) {
            spdlog::error(
                "markAsRead DB error: {}",
                e.base().what());
            onError(k500InternalServerError,
                    "Internal server error");
        };
}

// ----------------------------------------------------------------
// markAllAsRead
// ----------------------------------------------------------------

void NotificationService::markAllAsRead(
    const std::string &userId,
    Callback onSuccess,
    ErrCallback onError)
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

    *dbClient << sql << userId
        >> [onSuccess](const Result &result) {
            std::int64_t count = 0;
            if (!result.empty()) {
                count = result[0]["count"]
                            .as<std::int64_t>();
            }
            onSuccess({{"count", count}});
        }
        >> [onError](const DrogonDbException &e) {
            spdlog::error(
                "markAllAsRead DB error: {}",
                e.base().what());
            onError(k500InternalServerError,
                    "Internal server error");
        };
}

// ----------------------------------------------------------------
// deleteNotification
// ----------------------------------------------------------------

void NotificationService::deleteNotification(
    const std::string &notificationId,
    const std::string &userId,
    Callback onSuccess,
    ErrCallback onError)
{
    auto dbClient = db();
    const std::string sql = R"(
        DELETE FROM notifications
        WHERE id = $1 AND user_id = $2
        RETURNING id
    )";

    *dbClient << sql << notificationId << userId
        >> [onSuccess, onError](
               const Result &result) {
            if (result.empty()) {
                onError(k404NotFound,
                        "Notification not found");
                return;
            }
            onSuccess({{"deleted", true}});
        }
        >> [onError](const DrogonDbException &e) {
            spdlog::error(
                "deleteNotification DB error: {}",
                e.base().what());
            onError(k500InternalServerError,
                    "Internal server error");
        };
}

// ----------------------------------------------------------------
// Convenience event helpers
// ----------------------------------------------------------------

void NotificationService::notifyBadgeEarned(
    const std::string &userId,
    const json &badge)
{
    auto name = badge.value("name", "Unknown Badge");
    createNotification(
        userId,
        fmt::format("Badge Earned: {}", name),
        fmt::format(
            "Congratulations! You earned the "
            "\"{}\" badge.",
            name),
        "badge",
        badge,
        [](const json &) {
            // Fire-and-forget.
        },
        [](drogon::HttpStatusCode,
           const std::string &err) {
            spdlog::error(
                "notifyBadgeEarned failed: {}",
                err);
        });
}

void NotificationService::notifyLevelUp(
    const std::string &userId,
    std::int32_t newLevel)
{
    createNotification(
        userId,
        fmt::format("Level Up! You're now level {}",
                     newLevel),
        fmt::format(
            "You've reached level {}. Keep going!",
            newLevel),
        "level_up",
        {{"level", newLevel}},
        [](const json &) {},
        [](drogon::HttpStatusCode,
           const std::string &err) {
            spdlog::error(
                "notifyLevelUp failed: {}", err);
        });
}

void NotificationService::notifyStreakMilestone(
    const std::string &userId,
    std::int32_t days)
{
    createNotification(
        userId,
        fmt::format("{}-Day Streak!", days),
        fmt::format(
            "Amazing! You've maintained a {}-day "
            "streak.",
            days),
        "streak",
        {{"days", days}},
        [](const json &) {},
        [](drogon::HttpStatusCode,
           const std::string &err) {
            spdlog::error(
                "notifyStreakMilestone failed: {}",
                err);
        });
}

}  // namespace services
