/**
 * @file WebhookDispatcher.cpp
 * @brief Lifecycle + main loop for WebhookDispatcher.
 *
 * Claim / process / write-back logic lives in
 * webhook_dispatcher_run.cpp to keep this file short.
 */

#include "services/webhooks/WebhookDispatcher.h"

#include <spdlog/spdlog.h>

namespace nextra::webhooks
{

WebhookDispatcher::WebhookDispatcher(drogon::orm::DbClientPtr db,
                                     DispatcherConfig cfg)
    : db_(std::move(db)),
      cfg_(std::move(cfg)),
      breaker_(cfg_),
      client_(cfg_)
{
}

void WebhookDispatcher::start()
{
    if (running_.exchange(true)) return;
    worker_ = std::thread([this] {
        spdlog::info("webhook-dispatcher worker starting");
        while (running_.load())
        {
            try
            {
                runOnce();
            }
            catch (const std::exception& e)
            {
                spdlog::error("webhook-dispatcher tick failed: {}",
                              e.what());
            }
            std::this_thread::sleep_for(cfg_.pollInterval);
        }
        spdlog::info("webhook-dispatcher worker stopped");
    });
}

void WebhookDispatcher::stop()
{
    if (!running_.exchange(false)) return;
    if (worker_.joinable()) worker_.join();
}

void WebhookDispatcher::runOnce()
{
    const auto jobs = claimBatch();
    for (const auto& job : jobs)
    {
        if (!breaker_.shouldAttempt(job.endpointId))
        {
            spdlog::debug("circuit open for endpoint {}",
                          job.endpointId);
            DeliveryResult skipped;
            skipped.success = false;
            skipped.error = "circuit-open";
            markRetry(job, skipped);
            continue;
        }
        processOne(job);
    }
}

}  // namespace nextra::webhooks
