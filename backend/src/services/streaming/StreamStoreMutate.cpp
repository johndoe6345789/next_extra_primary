/**
 * @file StreamStoreMutate.cpp
 * @brief Mutating helpers for StreamStore (split to honour LOC cap).
 */

#include "services/streaming/StreamStore.h"

#include <drogon/orm/DbClient.h>

namespace nextra::streaming
{

std::optional<LiveStream> StreamStore::getBySlug(const std::string& slug)
{
    auto rows = db_->execSqlSync(
        "SELECT id, slug, title, ingest_key, status, started_at, "
        "ended_at, recording_key FROM live_streams WHERE slug=$1",
        slug);
    if (rows.empty()) return std::nullopt;
    LiveStream s;
    s.id        = rows[0]["id"].as<std::int64_t>();
    s.slug      = rows[0]["slug"].as<std::string>();
    s.title     = rows[0]["title"].as<std::string>();
    s.ingestKey = rows[0]["ingest_key"].as<std::string>();
    s.status    = statusFromString(rows[0]["status"].as<std::string>());
    return s;
}

void StreamStore::markEnded(std::int64_t id,
                            const std::optional<std::string>& rec)
{
    db_->execSqlSync(
        "UPDATE live_streams SET status='ended', ended_at=now(), "
        "recording_key=$2 WHERE id=$1",
        id, rec.value_or(""));
}

void StreamStore::block(std::int64_t id)
{
    db_->execSqlSync(
        "UPDATE live_streams SET status='blocked' WHERE id=$1", id);
}

void StreamStore::remove(std::int64_t id)
{
    db_->execSqlSync("DELETE FROM live_streams WHERE id=$1", id);
}

std::int64_t StreamStore::viewerJoin(std::int64_t streamId,
                                     const std::string& sessionId)
{
    auto rows = db_->execSqlSync(
        "INSERT INTO stream_viewers (stream_id, session_id) "
        "VALUES ($1,$2) RETURNING id",
        streamId, sessionId);
    return rows[0]["id"].as<std::int64_t>();
}

void StreamStore::viewerLeave(std::int64_t streamId,
                              const std::string& sessionId)
{
    db_->execSqlSync(
        "UPDATE stream_viewers SET left_at=now() "
        "WHERE stream_id=$1 AND session_id=$2 AND left_at IS NULL",
        streamId, sessionId);
}

}  // namespace nextra::streaming
