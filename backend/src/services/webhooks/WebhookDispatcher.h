#pragma once

/**
 * @file WebhookDispatcher.h
 * @brief Main daemon loop for the webhook-dispatcher service.
 *
 * Polls webhook_deliveries for rows whose next_retry_at is due,
 * claims them with SELECT ... FOR UPDATE SKIP LOCKED, asks the
 * circuit breaker whether the endpoint is available, posts the
 * payload via WebhookClient, and writes back the new status /
 * retry timestamp.  Pure coordinator — I/O lives in the other
 * classes so this file can stay under the 100-line cap.
 */

#include "services/webhooks/CircuitBreaker.h"
#include "services/webhooks/WebhookClient.h"
#include "services/webhooks/WebhookTypes.h"

#include <drogon/orm/DbClient.h>

#include <atomic>
#include <memory>
#include <thread>
#include <vector>

namespace nextra::webhooks
{

class WebhookDispatcher
{
public:
    WebhookDispatcher(drogon::orm::DbClientPtr db,
                      DispatcherConfig cfg);

    /// @brief Start the background worker thread.
    void start();

    /// @brief Signal shutdown and join the worker thread.
    void stop();

    /// @brief One tick cycle — exposed for tests and forced runs.
    void runOnce();

private:
    std::vector<DeliveryJob> claimBatch();
    void processOne(const DeliveryJob& job);
    void markDelivered(std::int64_t id, int status);
    void markRetry(const DeliveryJob& job, const DeliveryResult& r);

    drogon::orm::DbClientPtr db_;
    DispatcherConfig cfg_;
    CircuitBreaker breaker_;
    WebhookClient client_;
    std::atomic<bool> running_{false};
    std::thread worker_;
};

}  // namespace nextra::webhooks
