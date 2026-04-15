/**
 * @file UserBadgeService.cpp
 * @brief Implementation of user badge retrieval.
 */

#include "badges/backend/UserBadgeService.h"

#include <drogon/drogon.h>
#include <drogon/orm/DbClient.h>
#include <spdlog/spdlog.h>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

auto UserBadgeService::db() -> DbClientPtr
{
    return drogon::app().getDbClient();
}

void UserBadgeService::getUserBadges(const std::string& userId,
                                     Callback onSuccess, ErrCallback onError)
{
    auto dbClient = db();
    const std::string sql = R"(
        SELECT b.id, b.slug, b.name,
               b.description, b.icon_url,
               ub.earned_at
        FROM user_badges ub
        JOIN badges b ON b.id = ub.badge_id
        WHERE ub.user_id = $1
        ORDER BY ub.earned_at DESC
    )";

    *dbClient << sql << userId >> [onSuccess](const Result& result) {
        json badges = json::array();
        for (const auto& row : result) {
            json badge = {{"id", row["id"].as<std::string>()},
                          {"slug", row["slug"].as<std::string>()},
                          {"name", row["name"].as<std::string>()},
                          {"description", row["description"].as<std::string>()},
                          {"earnedAt", row["earned_at"].as<std::string>()}};
            if (!row["icon_url"].isNull()) {
                badge["iconUrl"] = row["icon_url"].as<std::string>();
            }
            badges.push_back(badge);
        }
        onSuccess(badges);
    } >> [onError](const DrogonDbException& e) {
        spdlog::error("getUserBadges DB error: {}", e.base().what());
        onError(k500InternalServerError, "Internal server error");
    };
}

} // namespace services
