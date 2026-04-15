/**
 * @file group_store_members.cpp
 * @brief Member management split from GroupStore.cpp.
 */

#include "GroupStore.h"

#include <drogon/drogon.h>

using namespace drogon;
using namespace drogon::orm;

namespace services::social::groups
{

bool GroupStore::addMember(
    std::int64_t groupId,
    const std::string& userId,
    const std::string& role)
{
    auto db = app().getDbClient();
    db->execSqlSync(
        "INSERT INTO group_members "
        "(group_id, user_id, role) "
        "VALUES ($1, $2::uuid, $3) "
        "ON CONFLICT (group_id, user_id) "
        "DO UPDATE SET role = EXCLUDED.role",
        groupId, userId, role);
    return true;
}

int GroupStore::removeMember(
    std::int64_t groupId,
    const std::string& userId)
{
    auto db = app().getDbClient();
    auto r = db->execSqlSync(
        "DELETE FROM group_members "
        "WHERE group_id = $1 "
        "AND user_id = $2::uuid",
        groupId, userId);
    return static_cast<int>(r.affectedRows());
}

nlohmann::json GroupStore::listMembers(
    std::int64_t groupId, int limit)
{
    auto db = app().getDbClient();
    auto r = db->execSqlSync(
        "SELECT user_id::text AS uid, role, "
        "joined_at::text AS ja FROM group_members "
        "WHERE group_id = $1 "
        "ORDER BY joined_at ASC LIMIT $2",
        groupId, limit);
    nlohmann::json out = nlohmann::json::array();
    for (const auto& row : r) {
        out.push_back({
            {"user_id", row["uid"].as<std::string>()},
            {"role",    row["role"].as<std::string>()},
            {"joined_at",
             row["ja"].as<std::string>()},
        });
    }
    return out;
}

} // namespace services::social::groups
