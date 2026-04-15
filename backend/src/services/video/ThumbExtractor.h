#pragma once

/**
 * @file ThumbExtractor.h
 * @brief Extract a single WebP thumbnail from a video asset
 *        using ffmpeg `-ss <N> -vframes 1 -c:v libwebp`.
 */

#include "services/video/VideoTypes.h"

#include <string>

namespace nextra::video
{

/**
 * @brief Run ffmpeg to grab a WebP thumbnail.
 * @param cfg        Transcoder config (ffmpeg binary path).
 * @param inputPath  Local path to the downloaded source video.
 * @param outputPath Destination path for the .webp file.
 * @return true on success (ffmpeg exit code 0).
 */
bool extractThumbnail(
    const TranscoderConfig& cfg,
    const std::string& inputPath,
    const std::string& outputPath);

}  // namespace nextra::video
