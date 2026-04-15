/**
 * @file StreamStore.cpp
 * @brief live_streams persistence layer.
 */

#include "services/streaming/StreamStore.h"
#include "services/streaming/IngestKey.h"

#include <drogon/orm/DbClient.h>

namespace nextra::streaming
{

std::string statusToString(StreamStatus s)
{
    switch (s)
    {
        case StreamStatus::Live:    return "live";
        case StreamStatus::Ended:   return "ended";
        case StreamStatus::Blocked: return "blocked";
        case StreamStatus::Idle:
        default:                    return "idle";
    }
}

StreamStatus statusFromString(const std::string& s)
{
    if (s == "live")    return StreamStatus::Live;
    if (s == "ended")   return StreamStatus::Ended;
    if (s == "blocked") return StreamStatus::Blocked;
    return StreamStatus::Idle;
}

static LiveStream rowTo(const drogon::orm::Row& r)
{
    LiveStream s;
    s.id        = r["id"].as<std::int64_t>();
    s.slug      = r["slug"].as<std::string>();
    s.title     = r["title"].as<std::string>();
    s.ingestKey = r["ingest_key"].as<std::string>();
    s.status    = statusFromString(r["status"].as<std::string>());
    if (!r["started_at"].isNull())
        s.startedAt = r["started_at"].as<std::string>();
    if (!r["ended_at"].isNull())
        s.endedAt = r["ended_at"].as<std::string>();
    if (!r["recording_key"].isNull())
        s.recordingKey = r["recording_key"].as<std::string>();
    return s;
}

StreamStore::StreamStore(std::shared_ptr<drogon::orm::DbClient> db)
    : db_(std::move(db)) {}

std::vector<LiveStream> StreamStore::listAll()
{
    auto rows = db_->execSqlSync(
        "SELECT id, slug, title, ingest_key, status, started_at, "
        "ended_at, recording_key FROM live_streams "
        "ORDER BY created_at DESC");
    std::vector<LiveStream> out;
    out.reserve(rows.size());
    for (const auto& r : rows) out.push_back(rowTo(r));
    return out;
}

std::optional<LiveStream> StreamStore::getByKey(const std::string& k)
{
    auto rows = db_->execSqlSync(
        "SELECT id, slug, title, ingest_key, status, started_at, "
        "ended_at, recording_key FROM live_streams "
        "WHERE ingest_key=$1", k);
    if (rows.empty()) return std::nullopt;
    return rowTo(rows[0]);
}

LiveStream StreamStore::create(const std::string& slug,
                               const std::string& title,
                               const std::optional<std::string>& owner)
{
    auto key = generateIngestKey();
    auto rows = db_->execSqlSync(
        "INSERT INTO live_streams (slug, title, ingest_key, owner_id) "
        "VALUES ($1,$2,$3,$4) RETURNING id, slug, title, ingest_key, "
        "status, started_at, ended_at, recording_key",
        slug, title, key, owner.value_or(""));
    return rowTo(rows[0]);
}

void StreamStore::markLive(std::int64_t id)
{
    db_->execSqlSync(
        "UPDATE live_streams SET status='live', started_at=now() "
        "WHERE id=$1 AND status<>'blocked'", id);
}

}  // namespace nextra::streaming
