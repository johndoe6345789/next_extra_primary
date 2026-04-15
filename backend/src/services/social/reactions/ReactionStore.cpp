/**
 * @file ReactionStore.cpp
 * @brief Insert / delete / summarise reactions (7.4).
 */

#include "ReactionStore.h"

#include <drogon/drogon.h>

using namespace drogon;
using namespace drogon::orm;

namespace services::social::reactions
{

bool ReactionStore::add(
    const std::string& targetType,
    const std::string& targetId,
    const std::string& userId,
    const std::string& emoji)
{
    auto db = app().getDbClient();
    db->execSqlSync(
        "INSERT INTO reactions "
        "(target_type, target_id, user_id, emoji) "
        "VALUES ($1, $2, $3::uuid, $4) "
        "ON CONFLICT DO NOTHING",
        targetType, targetId, userId, emoji);
    return true;
}

int ReactionStore::remove(
    const std::string& targetType,
    const std::string& targetId,
    const std::string& userId,
    const std::string& emoji)
{
    auto db = app().getDbClient();
    auto r = db->execSqlSync(
        "DELETE FROM reactions WHERE "
        "target_type = $1 AND target_id = $2 "
        "AND user_id = $3::uuid AND emoji = $4",
        targetType, targetId, userId, emoji);
    return static_cast<int>(r.affectedRows());
}

nlohmann::json ReactionStore::summary(
    const std::string& targetType,
    const std::string& targetId)
{
    auto db = app().getDbClient();
    auto r = db->execSqlSync(
        "SELECT emoji, COUNT(*)::int AS n "
        "FROM reactions WHERE target_type = $1 "
        "AND target_id = $2 GROUP BY emoji "
        "ORDER BY n DESC",
        targetType, targetId);
    nlohmann::json out = nlohmann::json::array();
    for (const auto& row : r) {
        out.push_back({
            {"emoji", row["emoji"].as<std::string>()},
            {"count", row["n"].as<int>()},
        });
    }
    return out;
}

} // namespace services::social::reactions
