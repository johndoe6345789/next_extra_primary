#pragma once

/**
 * @file media_streaming.h
 * @brief CLI subcommand that runs the media-streaming control plane.
 *
 * This daemon does not serve media itself — mediamtx does that.
 * What we run here is a small Drogon HTTP listener exposing the
 * StreamsController family under /api/streams/*, plus a webhook
 * endpoint mediamtx posts to on every publish/unpublish event.
 */

#include <string>

namespace commands
{

/**
 * @brief Run the media-streaming control plane daemon.
 *
 * Loads the Drogon config for DB credentials, reads
 * @c constants/media-streaming.json for mediamtx addresses, spins up
 * a Drogon HTTP server on its own port and blocks until a SIGINT or
 * SIGTERM arrives.  No background worker threads are required — the
 * daemon is pure request/response.
 *
 * @param config Path to a Drogon JSON config (DB + listener).
 * @throws std::runtime_error if the constants file is unreadable.
 */
void cmdMediaStreaming(const std::string& config);

}  // namespace commands
