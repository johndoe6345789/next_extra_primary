#pragma once

/**
 * @file ImageProcessor.h
 * @brief Worker loop coordinating the image-processor daemon.
 *
 * Owns an @ref ImageJobStore, a @ref VipsProcessor, and an
 * @ref S3Uploader; each worker thread pulls jobs, produces
 * variants, uploads them, and updates the ledger.
 */

#include "image/backend/ImageJobStore.h"
#include "image/backend/S3Uploader.h"
#include "image/backend/VipsProcessor.h"

#include <atomic>
#include <string>
#include <thread>
#include <vector>

namespace nextra::image
{

/// @brief Daemon-wide runtime configuration.
struct ProcessorConfig
{
    int workerCount{2};
    int pollIntervalMs{500};
    int maxAttempts{5};
};

/// @brief Parses @c constants/image-processor.json.
ProcessorConfig loadProcessorConfig(const std::string& p);

/**
 * @brief Multi-threaded image processing coordinator.
 *
 * @ref start spawns @c workerCount threads and returns;
 * @ref stop signals shutdown and joins them.
 */
class ImageProcessor
{
  public:
    ImageProcessor(ImageJobStore store,
                   S3Uploader uploader,
                   ProcessorConfig cfg);

    /// @brief Spawn workers and return.
    void start();

    /// @brief Signal shutdown and join all workers.
    void stop();

  private:
    void workerLoop();
    void processJob(ImageJob& job);
    std::vector<unsigned char> fetchSource(
        const std::string& url);

    ImageJobStore store_;
    S3Uploader uploader_;
    VipsProcessor vips_;
    ProcessorConfig cfg_;
    std::atomic<bool> stop_{false};
    std::vector<std::thread> workers_;
};

}  // namespace nextra::image
