/**
 * @file image_processor_worker.cpp
 * @brief Per-job worker logic for the image-processor.
 *
 * Split out of ImageProcessor.cpp so each file stays
 * within the 100-LOC project limit.
 */

#include "image/backend/ImageProcessor.h"

#include <spdlog/spdlog.h>

#include <chrono>
#include <exception>
#include <thread>

namespace nextra::image
{

void ImageProcessor::processJob(ImageJob& job)
{
    auto src = fetchSource(job.sourceUrl);
    if (src.empty())
    {
        store_.markFailed(
            job.id, "source fetch failed",
            cfg_.maxAttempts);
        return;
    }
    for (const auto& spec : job.variants)
    {
        auto r = vips_.process(
            src.data(), src.size(), spec);
        if (!r.ok)
        {
            store_.markFailed(
                job.id, r.error, cfg_.maxAttempts);
            return;
        }
        const auto key = std::to_string(job.id) + "/" +
                         spec.name + "." + spec.format;
        if (!uploader_.upload(
                key, r.variant.bytes,
                "image/" + spec.format))
        {
            store_.markFailed(
                job.id, "upload failed",
                cfg_.maxAttempts);
            return;
        }
        store_.recordVariant(
            job.id, r.variant, key,
            static_cast<std::int64_t>(
                r.variant.bytes.size()));
    }
    store_.markSuccess(job.id);
}

void ImageProcessor::workerLoop()
{
    while (!stop_.load())
    {
        auto job = store_.claimNext();
        if (!job)
        {
            std::this_thread::sleep_for(
                std::chrono::milliseconds(
                    cfg_.pollIntervalMs));
            continue;
        }
        try { processJob(*job); }
        catch (const std::exception& ex)
        {
            store_.markFailed(
                job->id, ex.what(), cfg_.maxAttempts);
        }
    }
}

}  // namespace nextra::image
