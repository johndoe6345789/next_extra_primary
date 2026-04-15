#pragma once

/**
 * @file VideoJobStore.h
 * @brief SQL ops for video_assets, video_renditions, transcode_jobs,
 *        plus the job_queue claim for `video.transcode` rows.
 */

#include "services/video/VideoTypes.h"

#include <drogon/orm/DbClient.h>

#include <memory>
#include <optional>
#include <string>
#include <vector>

namespace nextra::video
{

class VideoJobStore
{
public:
    explicit VideoJobStore(
        std::shared_ptr<drogon::orm::DbClient> db);

    /// Try to claim a video.transcode job from job_queue.
    std::optional<TranscodeRequest> claim(
        const std::string& workerId);

    /// Insert a new video_assets row and return its id.
    std::int64_t insertAsset(const std::string& sourceKey,
                             const std::string& mime);

    /// Insert a transcode_jobs row for @p assetId.
    std::int64_t insertTranscodeJob(std::int64_t assetId);

    /// Update the transcode_jobs progress column.
    void setProgress(std::int64_t tjId, int pct);

    /// Mark the job finished (status + optional error).
    void finish(std::int64_t tjId, bool ok, const std::string& err);

    /// Persist every rendition produced by a run.
    void insertRenditions(std::int64_t assetId,
                          const std::vector<Rendition>& rends);

private:
    std::shared_ptr<drogon::orm::DbClient> db_;
};

}  // namespace nextra::video
