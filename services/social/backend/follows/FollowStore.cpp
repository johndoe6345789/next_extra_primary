/**
 * @file FollowStore.cpp
 * @brief Directed-graph CRUD over follows table (7.1).
 */

#include "FollowStore.h"

#include <drogon/drogon.h>

using namespace drogon;
using namespace drogon::orm;

namespace services::social::follows
{

bool FollowStore::follow(
    const std::string& follower,
    const std::string& followee)
{
    if (follower == followee) return false;
    auto db = app().getDbClient();
    db->execSqlSync(
        "INSERT INTO follows (follower_id, followee_id) "
        "VALUES ($1::uuid, $2::uuid) "
        "ON CONFLICT DO NOTHING",
        follower, followee);
    return true;
}

int FollowStore::unfollow(
    const std::string& follower,
    const std::string& followee)
{
    auto db = app().getDbClient();
    auto r = db->execSqlSync(
        "DELETE FROM follows "
        "WHERE follower_id = $1::uuid "
        "AND followee_id = $2::uuid",
        follower, followee);
    return static_cast<int>(r.affectedRows());
}

nlohmann::json FollowStore::following(
    const std::string& user, int limit)
{
    auto db = app().getDbClient();
    auto r = db->execSqlSync(
        "SELECT followee_id::text AS uid, "
        "at::text AS at FROM follows "
        "WHERE follower_id = $1::uuid "
        "ORDER BY at DESC LIMIT $2",
        user, limit);
    nlohmann::json out = nlohmann::json::array();
    for (const auto& row : r) {
        out.push_back({
            {"user_id", row["uid"].as<std::string>()},
            {"at",      row["at"].as<std::string>()},
        });
    }
    return out;
}

nlohmann::json FollowStore::followers(
    const std::string& user, int limit)
{
    auto db = app().getDbClient();
    auto r = db->execSqlSync(
        "SELECT follower_id::text AS uid, "
        "at::text AS at FROM follows "
        "WHERE followee_id = $1::uuid "
        "ORDER BY at DESC LIMIT $2",
        user, limit);
    nlohmann::json out = nlohmann::json::array();
    for (const auto& row : r) {
        out.push_back({
            {"user_id", row["uid"].as<std::string>()},
            {"at",      row["at"].as<std::string>()},
        });
    }
    return out;
}

bool FollowStore::isFollowing(
    const std::string& a, const std::string& b)
{
    auto db = app().getDbClient();
    auto r = db->execSqlSync(
        "SELECT 1 FROM follows "
        "WHERE follower_id = $1::uuid "
        "AND followee_id = $2::uuid",
        a, b);
    return !r.empty();
}

} // namespace services::social::follows
