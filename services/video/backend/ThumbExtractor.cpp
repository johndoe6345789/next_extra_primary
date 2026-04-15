/**
 * @file ThumbExtractor.cpp
 * @brief Implementation of the WebP thumbnail extractor.
 */

#include "video/backend/ThumbExtractor.h"

#include "video/backend/FfmpegRunner.h"

#include <spdlog/spdlog.h>

#include <string>
#include <vector>

namespace nextra::video
{

bool extractThumbnail(
    const TranscoderConfig& cfg,
    const std::string& inputPath,
    const std::string& outputPath)
{
    const std::vector<std::string> argv{
        "-hide_banner",
        "-loglevel", "error",
        "-ss", std::to_string(cfg.thumbSeconds),
        "-i", inputPath,
        "-vframes", "1",
        "-c:v", "libwebp",
        "-qscale", "80",
        "-y", outputPath,
    };
    const auto r = runFfmpeg(cfg.ffmpegPath, argv, nullptr);
    if (r.exitCode != 0) {
        spdlog::error(
            "ffmpeg thumbnail failed exit={} tail={}",
            r.exitCode, r.stderrTail);
        return false;
    }
    return true;
}

}  // namespace nextra::video
