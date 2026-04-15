/**
 * @file HlsDashBuilder.cpp
 * @brief ffmpeg argv builders for HLS and DASH.
 */

#include "services/video/HlsDashBuilder.h"
#include "services/video/LadderSpec.h"

#include <format>

namespace nextra::video
{

std::vector<std::string> buildHlsArgs(
    const std::string& input,
    const std::string& outDir,
    const LadderRung& rung)
{
    return {
        "-hide_banner", "-loglevel", "error",
        "-progress", "pipe:2",
        "-i", input,
        "-vf", buildScaleFilter(rung),
        "-c:v", "libx264", "-preset", "veryfast",
        "-b:v", std::format("{}k", rung.videoBitrateK),
        "-c:a", "aac",
        "-b:a", std::format("{}k", rung.audioBitrateK),
        "-hls_time", "4",
        "-hls_playlist_type", "vod",
        "-hls_segment_filename",
        std::format("{}/seg_%03d.ts", outDir),
        "-y",
        std::format("{}/index.m3u8", outDir),
    };
}

std::vector<std::string> buildDashArgs(
    const std::string& input,
    const std::string& outDir,
    const LadderRung& rung)
{
    return {
        "-hide_banner", "-loglevel", "error",
        "-progress", "pipe:2",
        "-i", input,
        "-vf", buildScaleFilter(rung),
        "-c:v", "libx264", "-preset", "veryfast",
        "-b:v", std::format("{}k", rung.videoBitrateK),
        "-c:a", "aac",
        "-b:a", std::format("{}k", rung.audioBitrateK),
        "-f", "dash",
        "-seg_duration", "4",
        "-use_template", "1",
        "-use_timeline", "1",
        "-y",
        std::format("{}/manifest.mpd", outDir),
    };
}

}  // namespace nextra::video
