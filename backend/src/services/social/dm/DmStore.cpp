/**
 * @file DmStore.cpp
 * @brief Thread upsert + message insert for DMs (7.2).
 */

#include "DmStore.h"

#include <drogon/drogon.h>

using namespace drogon;
using namespace drogon::orm;

namespace services::social::dm
{

std::int64_t DmStore::upsertThread(
    const std::string& a, const std::string& b)
{
    auto db = app().getDbClient();
    auto existing = db->execSqlSync(
        "SELECT id FROM dm_threads WHERE "
        "LEAST(participant_a, participant_b) "
        "= LEAST($1::uuid, $2::uuid) AND "
        "GREATEST(participant_a, participant_b) "
        "= GREATEST($1::uuid, $2::uuid)",
        a, b);
    if (!existing.empty())
        return existing[0]["id"].as<std::int64_t>();
    auto r = db->execSqlSync(
        "INSERT INTO dm_threads "
        "(participant_a, participant_b) "
        "VALUES ($1::uuid, $2::uuid) RETURNING id",
        a, b);
    return r[0]["id"].as<std::int64_t>();
}

std::int64_t DmStore::sendMessage(
    std::int64_t threadId,
    const std::string& sender,
    const std::string& body)
{
    auto db = app().getDbClient();
    auto r = db->execSqlSync(
        "INSERT INTO dm_messages "
        "(thread_id, sender_id, body) "
        "VALUES ($1, $2::uuid, $3) RETURNING id",
        threadId, sender, body);
    return r[0]["id"].as<std::int64_t>();
}

bool DmStore::markRead(std::int64_t messageId)
{
    auto db = app().getDbClient();
    auto r = db->execSqlSync(
        "UPDATE dm_messages SET read_at = now() "
        "WHERE id = $1 AND read_at IS NULL",
        messageId);
    return r.affectedRows() > 0;
}

} // namespace services::social::dm
