/**
 * @file VideoJobStore.cpp
 * @brief SQL implementation for the video transcoder tables.
 */

#include "services/video/VideoJobStore.h"

#include <nlohmann/json.hpp>

namespace nextra::video
{

VideoJobStore::VideoJobStore(
    std::shared_ptr<drogon::orm::DbClient> db)
    : db_(std::move(db))
{
}

std::optional<TranscodeRequest> VideoJobStore::claim(
    const std::string& workerId)
{
    const auto r = db_->execSqlSync(
        "UPDATE job_queue SET status='running', locked_by=$1, "
        "locked_at=now(), attempts=attempts+1 WHERE id=("
        "SELECT id FROM job_queue WHERE handler='video.transcode' "
        "AND status IN ('queued','retrying') AND run_at<=now() "
        "ORDER BY priority, run_at FOR UPDATE SKIP LOCKED LIMIT 1) "
        "RETURNING id, payload::text",
        workerId);
    if (r.empty()) return std::nullopt;
    TranscodeRequest req;
    const auto j = nlohmann::json::parse(
        r[0]["payload"].as<std::string>());
    req.assetId        = j.value("assetId", std::int64_t{0});
    req.transcodeJobId = j.value("transcodeJobId", std::int64_t{0});
    req.sourceKey      = j.value("sourceKey", std::string{});
    req.mime           = j.value("mime", std::string{"video/mp4"});
    return req;
}

std::int64_t VideoJobStore::insertAsset(
    const std::string& sourceKey, const std::string& mime)
{
    const auto r = db_->execSqlSync(
        "INSERT INTO video_assets(source_key, mime) "
        "VALUES($1,$2) RETURNING id",
        sourceKey, mime);
    return r[0]["id"].as<std::int64_t>();
}

std::int64_t VideoJobStore::insertTranscodeJob(std::int64_t assetId)
{
    const auto r = db_->execSqlSync(
        "INSERT INTO transcode_jobs(asset_id,status,progress) "
        "VALUES($1,'queued',0) RETURNING id",
        assetId);
    return r[0]["id"].as<std::int64_t>();
}

void VideoJobStore::setProgress(std::int64_t tjId, int pct)
{
    db_->execSqlSync(
        "UPDATE transcode_jobs SET progress=$2, status='running', "
        "updated_at=now() WHERE id=$1",
        tjId, pct);
}

void VideoJobStore::finish(
    std::int64_t tjId, bool ok, const std::string& err)
{
    db_->execSqlSync(
        "UPDATE transcode_jobs SET status=$2, error=$3, "
        "progress=$4, updated_at=now() WHERE id=$1",
        tjId,
        std::string(ok ? "succeeded" : "failed"),
        err,
        ok ? 100 : 0);
}

void VideoJobStore::insertRenditions(
    std::int64_t assetId, const std::vector<Rendition>& rends)
{
    for (const auto& r : rends) {
        db_->execSqlSync(
            "INSERT INTO video_renditions"
            "(asset_id,kind,ladder,s3_key,bytes) "
            "VALUES($1,$2,$3,$4,$5)",
            assetId, r.kind, r.ladder, r.s3Key, r.bytes);
    }
}

}  // namespace nextra::video
