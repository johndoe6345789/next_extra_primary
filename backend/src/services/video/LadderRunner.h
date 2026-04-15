#pragma once

/**
 * @file LadderRunner.h
 * @brief Executes every ladder rung (HLS + DASH) for a transcode.
 */

#include "services/video/VideoTypes.h"

#include <drogon/orm/DbClient.h>

#include <memory>
#include <string>
#include <vector>

namespace nextra::video
{

/**
 * @brief Walk every ladder rung in @p cfg, run HLS and DASH
 *        ffmpeg passes, upload the resulting manifests to s3,
 *        and append a Rendition entry for each to @p out.
 * @return false on the first ffmpeg failure.
 */
bool runLadders(
    const TranscoderConfig& cfg,
    const TranscodeRequest& req,
    std::int64_t durationMs,
    const std::string& localSource,
    std::shared_ptr<drogon::orm::DbClient> db,
    std::vector<Rendition>& out);

}  // namespace nextra::video
