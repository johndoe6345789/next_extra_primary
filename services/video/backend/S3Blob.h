#pragma once

/**
 * @file S3Blob.h
 * @brief Minimal PUT/GET helpers against the in-repo s3server.
 *
 * The s3server in `tools/s3server/` speaks a simplified S3-style
 * HTTP protocol.  For Phase 4.2 we only need two operations:
 * download a source object to a local file, and upload a local
 * file to a destination key.  Signing is not required in dev
 * (the access key is whitelisted in s3server config).
 */

#include "video/backend/VideoTypes.h"

#include <string>

namespace nextra::video
{

/**
 * @brief Download @p key from s3 into @p localPath.
 * @return true on HTTP 200.
 */
bool s3Download(const TranscoderConfig& cfg,
                const std::string& key,
                const std::string& localPath);

/**
 * @brief Upload @p localPath to @p key, returning the byte count
 *        on success or -1 on failure.
 */
std::int64_t s3Upload(const TranscoderConfig& cfg,
                      const std::string& localPath,
                      const std::string& key);

}  // namespace nextra::video
