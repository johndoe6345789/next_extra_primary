/**
 * @file NotificationQuery.cpp
 * @brief Unread-count query for notifications.
 */

#include "services/NotificationQuery.h"

#include <drogon/orm/DbClient.h>
#include <spdlog/spdlog.h>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

auto NotificationQuery::db() -> DbClientPtr
{
    return drogon::app().getDbClient();
}

void NotificationQuery::getUnreadCount(
    const std::string& userId,
    Callback onSuccess,
    ErrCallback onError)
{
    auto dbClient = db();
    const std::string sql = R"(
        SELECT COUNT(*) AS count
        FROM notifications
        WHERE user_id = $1 AND read = false
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
            spdlog::error(
                "getUnreadCount DB error: {}",
                e.base().what());
            onError(k500InternalServerError,
                    "Internal server error");
        };
}

} // namespace services
