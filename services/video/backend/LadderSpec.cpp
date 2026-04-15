/**
 * @file LadderSpec.cpp
 * @brief Implementation of the ladder config loader.
 */

#include "video/backend/LadderSpec.h"

#include <nlohmann/json.hpp>

#include <fstream>
#include <format>
#include <stdexcept>

namespace nextra::video
{

TranscoderConfig loadTranscoderConfig(const std::string& path)
{
    std::ifstream f(path);
    if (!f) {
        throw std::runtime_error(
            "video transcoder config missing: " + path);
    }
    nlohmann::json j;
    f >> j;

    TranscoderConfig cfg;
    cfg.ffmpegPath     = j.value("ffmpegPath", cfg.ffmpegPath);
    cfg.ffprobePath    = j.value("ffprobePath", cfg.ffprobePath);
    cfg.workerCount    = j.value("workerCount", 2);
    cfg.pollIntervalMs = j.value("pollIntervalMs", 2000);
    cfg.workDir        = j.value("workDir", cfg.workDir);
    cfg.thumbSeconds   = j.value("thumbSeconds", 3);

    const auto s3 = j.value("s3", nlohmann::json::object());
    cfg.s3Endpoint  = s3.value("endpoint", std::string{});
    cfg.s3Bucket    = s3.value("bucket", std::string{});
    cfg.s3AccessKey = s3.value("accessKey", std::string{});
    cfg.s3SecretKey = s3.value("secretKey", std::string{});

    for (const auto& l : j.value("ladders", nlohmann::json::array())) {
        LadderRung r;
        r.name          = l.value("name", std::string{});
        r.width         = l.value("width", 0);
        r.height        = l.value("height", 0);
        r.videoBitrateK = l.value("videoBitrateK", 0);
        r.audioBitrateK = l.value("audioBitrateK", 0);
        cfg.ladders.push_back(std::move(r));
    }
    if (cfg.ladders.empty()) {
        throw std::runtime_error(
            "video transcoder config has no ladders");
    }
    return cfg;
}

std::string buildScaleFilter(const LadderRung& rung)
{
    return std::format(
        "scale={}:{}:force_original_aspect_ratio=decrease",
        rung.width, rung.height);
}

}  // namespace nextra::video
