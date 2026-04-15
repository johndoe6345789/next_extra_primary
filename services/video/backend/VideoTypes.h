#pragma once

/**
 * @file VideoTypes.h
 * @brief Shared DTOs for the Phase 4.2 video-transcoder daemon.
 */

#include <cstdint>
#include <string>
#include <vector>

namespace nextra::video
{

/**
 * @brief A single output ladder rung (e.g. 720p).
 */
struct LadderRung
{
    std::string name;      ///< e.g. "720p"
    int width{0};
    int height{0};
    int videoBitrateK{0};  ///< kilobits/second
    int audioBitrateK{0};
};

/**
 * @brief Runtime configuration for the transcoder daemon.
 */
struct TranscoderConfig
{
    std::string ffmpegPath{"/usr/bin/ffmpeg"};
    std::string ffprobePath{"/usr/bin/ffprobe"};
    int         workerCount{2};
    int         pollIntervalMs{2000};
    std::string workDir{"/tmp/nextra-transcode"};
    std::string s3Endpoint;
    std::string s3Bucket;
    std::string s3AccessKey;
    std::string s3SecretKey;
    int         thumbSeconds{3};
    std::vector<LadderRung> ladders;
};

/**
 * @brief Payload carried on a `video.transcode` job_queue row.
 */
struct TranscodeRequest
{
    std::int64_t assetId{0};
    std::int64_t transcodeJobId{0};
    std::string  sourceKey;     ///< s3 key of the uploaded source
    std::string  mime;
};

/**
 * @brief Describes an artifact uploaded to s3 after ffmpeg runs.
 */
struct Rendition
{
    std::string kind;   ///< "hls" | "dash" | "thumb_webp"
    std::string ladder; ///< "360p" | "720p" | "1080p" | ""
    std::string s3Key;
    std::int64_t bytes{0};
};

}  // namespace nextra::video
