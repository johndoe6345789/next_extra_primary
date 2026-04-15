#pragma once

/**
 * @file WebhookClient.h
 * @brief Outbound HTTP client for webhook deliveries.
 *
 * Thin wrapper over drogon::HttpClient that handles URL parsing,
 * body marshalling, HMAC signing, and timeout configuration.  The
 * dispatcher calls send() once per delivery attempt.
 */

#include "webhooks/backend/WebhookTypes.h"

#include <string>

namespace nextra::webhooks
{

class WebhookClient
{
public:
    explicit WebhookClient(const DispatcherConfig& cfg) : cfg_(cfg) {}

    /**
     * @brief POST the delivery payload with HMAC headers.
     * @param job Delivery to attempt.
     * @return Success flag, HTTP status code, and error string.
     */
    DeliveryResult send(const DeliveryJob& job);

private:
    const DispatcherConfig& cfg_;
};

}  // namespace nextra::webhooks
