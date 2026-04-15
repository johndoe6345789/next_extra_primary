#pragma once

/**
 * @file video_transcoder.h
 * @brief CLI subcommand for the Phase 4.2 video transcoder daemon.
 */

#include <string>

namespace commands
{

/**
 * @brief Run the video-transcoder daemon.
 *
 * Loads `constants/video-transcoder.json`, spins up @c workerCount
 * threads that each poll the job_queue for `video.transcode` rows,
 * and supervises ffmpeg child processes to produce HLS + DASH
 * ladders plus a WebP thumbnail.  Blocks until SIGINT/SIGTERM.
 *
 * @param config Path to the Drogon JSON config with DB credentials.
 * @throws std::runtime_error on missing/invalid config files.
 */
void cmdVideoTranscoder(const std::string& config);

}  // namespace commands
