/**
 * @file dm_store_reads.cpp
 * @brief Read-side queries for DmStore (split from
 *        DmStore.cpp to keep files under 100 LOC).
 */

#include "DmStore.h"

#include <drogon/drogon.h>

using namespace drogon;
using namespace drogon::orm;

namespace services::social::dm
{

nlohmann::json DmStore::listThreads(
    const std::string& user, int limit)
{
    auto db = app().getDbClient();
    auto r = db->execSqlSync(
        "SELECT id, "
        "participant_a::text AS a, "
        "participant_b::text AS b, "
        "created_at::text AS ca "
        "FROM dm_threads WHERE "
        "participant_a = $1::uuid OR "
        "participant_b = $1::uuid "
        "ORDER BY created_at DESC LIMIT $2",
        user, limit);
    nlohmann::json out = nlohmann::json::array();
    for (const auto& row : r) {
        out.push_back({
            {"id",  row["id"].as<std::int64_t>()},
            {"a",   row["a"].as<std::string>()},
            {"b",   row["b"].as<std::string>()},
            {"at",  row["ca"].as<std::string>()},
        });
    }
    return out;
}

nlohmann::json DmStore::listMessages(
    std::int64_t threadId, int limit)
{
    auto db = app().getDbClient();
    auto r = db->execSqlSync(
        "SELECT id, sender_id::text AS sid, "
        "body, sent_at::text AS sa, "
        "read_at::text AS ra "
        "FROM dm_messages WHERE thread_id = $1 "
        "ORDER BY sent_at DESC LIMIT $2",
        threadId, limit);
    nlohmann::json out = nlohmann::json::array();
    for (const auto& row : r) {
        out.push_back({
            {"id",      row["id"].as<std::int64_t>()},
            {"sender",  row["sid"].as<std::string>()},
            {"body",    row["body"].as<std::string>()},
            {"sent_at", row["sa"].as<std::string>()},
            {"read_at",
             row["ra"].isNull()
                 ? "" : row["ra"].as<std::string>()},
        });
    }
    return out;
}

} // namespace services::social::dm
