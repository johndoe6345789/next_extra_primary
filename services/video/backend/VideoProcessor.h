#pragma once

/**
 * @file VideoProcessor.h
 * @brief End-to-end worker for a single `video.transcode` job.
 *
 * Pipeline:
 *   1. Claim the next `video.transcode` row from job_queue.
 *   2. Download source from the in-repo s3server into workDir.
 *   3. Probe duration with ffprobe.
 *   4. For each ladder rung: ffmpeg HLS → upload to s3.
 *   5. For each ladder rung: ffmpeg DASH → upload to s3.
 *   6. Thumbnail (WebP) → upload.
 *   7. Insert video_renditions rows + mark transcode_jobs done.
 *
 * Progress is streamed live from FfmpegRunner into ProgressParser
 * and written to the transcode_jobs.progress column on each
 * flushed frame.
 */

#include "video/backend/VideoTypes.h"

#include <drogon/orm/DbClient.h>

#include <memory>
#include <string>
#include <vector>

namespace nextra::video
{

/**
 * @brief Per-worker processor.  Instances are cheap to construct.
 */
class VideoProcessor
{
public:
    VideoProcessor(std::shared_ptr<drogon::orm::DbClient> db,
                   TranscoderConfig cfg);

    /**
     * @brief Claim one `video.transcode` job and run it.
     * @return true if a job was claimed (regardless of outcome),
     *         false if the queue was empty.
     */
    bool processOne(const std::string& workerId);

private:
    bool runLadders(const TranscodeRequest& req,
                    std::int64_t durationMs,
                    const std::string& localSource,
                    std::vector<Rendition>& out);
    void writeProgress(std::int64_t jobId, int pct);
    void writeRenditions(std::int64_t assetId,
                         const std::vector<Rendition>& rends);

    std::shared_ptr<drogon::orm::DbClient> db_;
    TranscoderConfig cfg_;
};

}  // namespace nextra::video
