#pragma once

/**
 * @file HlsDashBuilder.h
 * @brief Build ffmpeg argv vectors for HLS and DASH outputs.
 */

#include "services/video/VideoTypes.h"

#include <string>
#include <vector>

namespace nextra::video
{

/**
 * @brief ffmpeg argv for one HLS ladder rung.
 * @param input Local source video path.
 * @param outDir Per-rung output directory.
 * @param rung Ladder rung spec.
 */
std::vector<std::string> buildHlsArgs(
    const std::string& input,
    const std::string& outDir,
    const LadderRung& rung);

/**
 * @brief ffmpeg argv for one DASH ladder rung.
 */
std::vector<std::string> buildDashArgs(
    const std::string& input,
    const std::string& outDir,
    const LadderRung& rung);

}  // namespace nextra::video
