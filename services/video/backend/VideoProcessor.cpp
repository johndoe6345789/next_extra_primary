/**
 * @file VideoProcessor.cpp
 * @brief End-to-end worker for a single video.transcode job.
 */

#include "video/backend/VideoProcessor.h"

#include "video/backend/LadderRunner.h"
#include "video/backend/S3Blob.h"
#include "video/backend/ThumbExtractor.h"
#include "video/backend/VideoJobStore.h"

#include <spdlog/spdlog.h>

#include <filesystem>
#include <format>

namespace fs = std::filesystem;

namespace nextra::video
{

VideoProcessor::VideoProcessor(
    std::shared_ptr<drogon::orm::DbClient> db, TranscoderConfig cfg)
    : db_(std::move(db)), cfg_(std::move(cfg))
{
}

void VideoProcessor::writeProgress(std::int64_t jobId, int pct)
{
    VideoJobStore(db_).setProgress(jobId, pct);
}

void VideoProcessor::writeRenditions(
    std::int64_t assetId, const std::vector<Rendition>& rends)
{
    VideoJobStore(db_).insertRenditions(assetId, rends);
}

bool VideoProcessor::runLadders(
    const TranscodeRequest& req, std::int64_t durationMs,
    const std::string& localSource, std::vector<Rendition>& out)
{
    return nextra::video::runLadders(
        cfg_, req, durationMs, localSource, db_, out);
}

bool VideoProcessor::processOne(const std::string& workerId)
{
    VideoJobStore store(db_);
    const auto req = store.claim(workerId);
    if (!req) return false;
    const auto src = std::format(
        "{}/{}/source.bin", cfg_.workDir, req->assetId);
    fs::create_directories(fs::path(src).parent_path());
    if (!s3Download(cfg_, req->sourceKey, src)) {
        store.finish(req->transcodeJobId, false, "s3 download");
        return true;
    }
    std::vector<Rendition> rends;
    const bool ok = runLadders(*req, 0, src, rends);
    const auto thumb = std::format(
        "{}/{}/thumb.webp", cfg_.workDir, req->assetId);
    if (ok && extractThumbnail(cfg_, src, thumb)) {
        const auto tkey =
            std::format("{}/thumb.webp", req->assetId);
        rends.push_back(
            {"thumb_webp", "", tkey, s3Upload(cfg_, thumb, tkey)});
    }
    writeRenditions(req->assetId, rends);
    store.finish(req->transcodeJobId, ok, ok ? "" : "ffmpeg failed");
    return true;
}

}  // namespace nextra::video
