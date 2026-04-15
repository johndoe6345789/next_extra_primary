#pragma once

/**
 * @file CircuitBreaker.h
 * @brief Per-endpoint circuit breaker keyed by endpoint id.
 *
 * Three states: closed, open, half-open.  The dispatcher consults
 * shouldAttempt before every POST, records the outcome, and the
 * breaker trips open after N consecutive failures.  After a
 * cooldown window one probe is allowed through (half-open);
 * success closes the breaker, failure re-opens it.
 */

#include "webhooks/backend/WebhookTypes.h"

#include <chrono>
#include <cstdint>
#include <mutex>
#include <unordered_map>

namespace nextra::webhooks
{

class CircuitBreaker
{
public:
    explicit CircuitBreaker(const DispatcherConfig& cfg) : cfg_(cfg) {}

    /// @brief Check whether a delivery attempt is permitted right now.
    bool shouldAttempt(std::int64_t endpointId);

    /// @brief Record a successful delivery; closes the breaker.
    void recordSuccess(std::int64_t endpointId);

    /// @brief Record a failure; opens the breaker on threshold.
    void recordFailure(std::int64_t endpointId);

private:
    enum class State { Closed, Open, HalfOpen };
    struct Entry
    {
        State state{State::Closed};
        int failures{0};
        std::chrono::steady_clock::time_point openedAt{};
    };

    const DispatcherConfig& cfg_;
    std::mutex mu_;
    std::unordered_map<std::int64_t, Entry> entries_;
};

}  // namespace nextra::webhooks
