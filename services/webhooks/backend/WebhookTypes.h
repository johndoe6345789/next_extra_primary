#pragma once

/**
 * @file WebhookTypes.h
 * @brief Shared value types for the webhook-dispatcher daemon.
 *
 * Kept header-only and POD-ish so every translation unit in the
 * webhooks subsystem can include this cheaply without pulling in
 * Drogon or nlohmann::json.
 */

#include <chrono>
#include <cstdint>
#include <optional>
#include <string>
#include <vector>

namespace nextra::webhooks
{

/// @brief Tunables loaded from constants/webhook-dispatcher.json.
struct DispatcherConfig
{
    std::size_t claimBatchSize{25};
    std::chrono::milliseconds pollInterval{2000};
    std::chrono::milliseconds requestTimeout{15000};
    int maxAttempts{8};
    std::chrono::milliseconds baseDelay{5000};
    std::chrono::milliseconds maxDelay{3600000};
    double jitterRatio{0.2};
    int circuitFailThreshold{5};
    std::chrono::milliseconds circuitCooldown{300000};
    std::string signatureHeader{"X-Nextra-Signature"};
    std::string timestampHeader{"X-Nextra-Timestamp"};
};

/// @brief Row claimed from webhook_deliveries for one delivery cycle.
struct DeliveryJob
{
    std::int64_t id{};
    std::int64_t endpointId{};
    std::string eventType;
    std::string payload;  ///< JSON-encoded payload body.
    int attempts{};
    std::string url;
    std::string secret;
};

/// @brief Result of a single POST attempt.
struct DeliveryResult
{
    bool success{false};
    int statusCode{0};
    std::string error;
};

}  // namespace nextra::webhooks
