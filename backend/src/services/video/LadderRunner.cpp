/**
 * @file LadderRunner.cpp
 * @brief Implementation of the per-asset HLS/DASH ladder loop.
 */

#include "services/video/LadderRunner.h"

#include "services/video/FfmpegRunner.h"
#include "services/video/HlsDashBuilder.h"
#include "services/video/ProgressParser.h"
#include "services/video/S3Blob.h"
#include "services/video/VideoJobStore.h"

#include <filesystem>
#include <format>

namespace fs = std::filesystem;

namespace nextra::video
{

bool runLadders(
    const TranscoderConfig& cfg,
    const TranscodeRequest& req,
    std::int64_t durationMs,
    const std::string& localSource,
    std::shared_ptr<drogon::orm::DbClient> db,
    std::vector<Rendition>& out)
{
    VideoJobStore store(db);
    for (const auto& rung : cfg.ladders) {
        const auto hlsDir = std::format(
            "{}/{}/hls/{}", cfg.workDir, req.assetId, rung.name);
        fs::create_directories(hlsDir);
        ProgressParser p(durationMs);
        auto cb = [&](const std::string& l) {
            if (p.feed(l))
                store.setProgress(req.transcodeJobId, p.percent());
        };
        auto r = runFfmpeg(
            cfg.ffmpegPath,
            buildHlsArgs(localSource, hlsDir, rung), cb);
        if (r.exitCode != 0) return false;
        const auto key = std::format(
            "{}/hls/{}/index.m3u8", req.assetId, rung.name);
        out.push_back({"hls", rung.name, key,
                       s3Upload(cfg, hlsDir + "/index.m3u8", key)});

        const auto dashDir = std::format(
            "{}/{}/dash/{}", cfg.workDir, req.assetId, rung.name);
        fs::create_directories(dashDir);
        auto d = runFfmpeg(
            cfg.ffmpegPath,
            buildDashArgs(localSource, dashDir, rung), nullptr);
        if (d.exitCode != 0) return false;
        const auto dkey = std::format(
            "{}/dash/{}/manifest.mpd", req.assetId, rung.name);
        out.push_back({"dash", rung.name, dkey,
                       s3Upload(cfg, dashDir + "/manifest.mpd",
                                dkey)});
    }
    return true;
}

}  // namespace nextra::video
