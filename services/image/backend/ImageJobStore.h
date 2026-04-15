#pragma once

/**
 * @file ImageJobStore.h
 * @brief Postgres access layer for the image-processor.
 *
 * Uses Drogon's ORM @c DbClient with
 * @c SELECT ... FOR UPDATE SKIP LOCKED semantics so that
 * multiple worker threads (or pods) can safely pull work
 * from the same queue without double-claiming a row.
 */

#include "image/backend/ImageTypes.h"

#include <drogon/orm/DbClient.h>

#include <optional>
#include <string>

namespace nextra::image
{

/// @brief Thin repository object around the jobs table.
class ImageJobStore
{
  public:
    explicit ImageJobStore(
        drogon::orm::DbClientPtr db)
        : db_(std::move(db)) {}

    /**
     * @brief Atomically claim the next pending job.
     * @return The claimed job, or std::nullopt if idle.
     */
    std::optional<ImageJob> claimNext();

    /**
     * @brief Mark a job as successfully processed.
     * @param jobId Identifier returned by @ref claimNext.
     */
    void markSuccess(std::int64_t jobId);

    /**
     * @brief Mark a job as failed and increment attempts.
     * @param jobId     Identifier returned by claimNext.
     * @param error     Human-readable error message.
     * @param maxTries  Retry budget from config.
     */
    void markFailed(std::int64_t jobId,
                    const std::string& error,
                    int maxTries);

    /**
     * @brief Record a produced variant row.
     * @param jobId  Parent job id.
     * @param v      Variant descriptor (dims + format).
     * @param key    Object key inside the configured bucket.
     * @param bytes  Payload size in bytes.
     */
    void recordVariant(std::int64_t jobId,
                       const Variant& v,
                       const std::string& key,
                       std::int64_t bytes);

  private:
    drogon::orm::DbClientPtr db_;
};

}  // namespace nextra::image
