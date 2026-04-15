#pragma once

/**
 * @file LadderSpec.h
 * @brief Loads HLS/DASH ladder presets from
 *        constants/video-transcoder.json.
 */

#include "services/video/VideoTypes.h"

#include <string>

namespace nextra::video
{

/**
 * @brief Parse a transcoder config JSON file into a
 *        TranscoderConfig struct.
 * @param path Absolute or relative path to the JSON file.
 * @throws std::runtime_error on I/O or parse failure.
 */
TranscoderConfig loadTranscoderConfig(const std::string& path);

/**
 * @brief Build the ffmpeg -filter_complex scale argument
 *        for a single ladder rung.
 * @param rung The ladder rung to render.
 * @return A scale=W:H:force_original_aspect_ratio=decrease filter.
 */
std::string buildScaleFilter(const LadderRung& rung);

}  // namespace nextra::video
