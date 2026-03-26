/**
 * @file NotificationPager.cpp
 * @brief Paginated notification listing for a user.
 */

#include "services/NotificationPager.h"
#include "services/NotificationFormatter.h"

#include <drogon/orm/DbClient.h>
#include <spdlog/spdlog.h>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

auto NotificationPager::db() -> DbClientPtr
{
    return drogon::app().getDbClient();
}

void NotificationPager::getNotifications(const std::string& userId,
                                         std::int32_t page,
                                         std::int32_t perPage,
                                         Callback onSuccess,
                                         ErrCallback onError)
{
    if (page < 1)
        page = 1;
    if (perPage < 1)
        perPage = 20;
    if (perPage > 100)
        perPage = 100;

    auto dbClient = db();
    auto offset = static_cast<std::int64_t>(page - 1) * perPage;

    const std::string countSql = R"(
        SELECT COUNT(*) AS total
        FROM notifications WHERE user_id = $1
    )";

    *dbClient << countSql << userId >> [dbClient, userId, page, perPage, offset,
                                        onSuccess, onError](const Result& cr) {
        std::int64_t total = 0;
        if (!cr.empty()) {
            total = cr[0]["total"].as<std::int64_t>();
        }
        const std::string dataSql = R"(
                SELECT id, user_id, title, body, type,
                       metadata, read, created_at
                FROM notifications
                WHERE user_id = $1
                ORDER BY created_at DESC
                LIMIT $2 OFFSET $3
            )";
        *dbClient << dataSql << userId << perPage << offset >>
            [total, page, perPage, onSuccess](const Result& result) {
                json items = json::array();
                for (const auto& r : result) {
                    items.push_back(NotificationFormatter ::rowToJson(r));
                }
                std::int64_t totalPages = (total + perPage - 1) / perPage;
                onSuccess({{"data", items},
                           {"pagination",
                            {{"total", total},
                             {"page", page},
                             {"perPage", perPage},
                             {"totalPages", totalPages}}}});
            } >>
            [onError](const DrogonDbException& e) {
                spdlog::error("getNotifications data "
                              "DB error: {}",
                              e.base().what());
                onError(k500InternalServerError, "Internal server error");
            };
    } >> [onError](const DrogonDbException& e) {
        spdlog::error("getNotifications count DB error: {}", e.base().what());
        onError(k500InternalServerError, "Internal server error");
    };
}

} // namespace services
