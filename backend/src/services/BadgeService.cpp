/**
 * @file BadgeService.cpp
 * @brief Implementation of BadgeService.
 */

#include "services/BadgeService.h"
#include "services/BadgeInserter.h"

#include <drogon/drogon.h>
#include <drogon/orm/DbClient.h>
#include <spdlog/spdlog.h>

#include <memory>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

auto BadgeService::db() -> DbClientPtr
{
    return drogon::app().getDbClient();
}

void BadgeService::checkAndAwardBadges(const std::string& userId,
                                       Callback onSuccess, ErrCallback onError)
{
    const std::string sql = R"(
        SELECT u.total_points, u.current_streak,
               COUNT(DISTINCT cm.id) AS msg_count
        FROM users u
        LEFT JOIN chat_messages cm
            ON cm.user_id = u.id
        WHERE u.id = $1
        GROUP BY u.id
    )";
    auto dbClient = db();
    *dbClient << sql << userId >> [userId, onSuccess,
                                   onError](const Result& s) {
        if (s.empty()) {
            onSuccess(json::array());
            return;
        }
        auto pts = s[0]["total_points"].as<std::int64_t>();
        auto sk = s[0]["current_streak"].as<std::int32_t>();
        auto mg = s[0]["msg_count"].as<std::int64_t>();
        // Build candidate list inline.
        json cands = json::array();
        auto add = [&](bool ok, std::string_view sl, std::string_view nm,
                       std::string_view ds) {
            if (ok)
                cands.push_back(
                    {{"slug", sl}, {"name", nm}, {"description", ds}});
        };
        add(pts >= 100, "first_100_points", "Century", "Earned 100 points");
        add(pts >= 1000, "first_1000_points", "Millennial",
            "Earned 1000 points");
        add(sk >= 7, "streak_7", "Week Warrior", "7-day streak");
        add(sk >= 30, "streak_30", "Monthly Master", "30-day streak");
        add(mg >= 10, "chatty_10", "Conversationalist",
            "Sent 10 chat messages");
        add(mg >= 100, "chatty_100", "Chatterbox", "Sent 100 chat messages");
        if (cands.empty()) {
            onSuccess(json::array());
            return;
        }
        auto rem = std::make_shared<std::size_t>(cands.size());
        auto res = std::make_shared<json>(json::array());
        BadgeInserter ins;
        for (const auto& b : cands)
            ins.insertOne(userId, b, rem, res, onSuccess);
    } >> [onError](const DrogonDbException& e) {
        spdlog::error("checkAndAwardBadges error: {}", e.base().what());
        onError(k500InternalServerError, "Internal server error");
    };
}

} // namespace services
