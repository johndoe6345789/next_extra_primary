/**
 * @file CircuitBreaker.cpp
 * @brief Three-state circuit breaker implementation.
 */

#include "services/webhooks/CircuitBreaker.h"

namespace nextra::webhooks
{

bool CircuitBreaker::shouldAttempt(std::int64_t endpointId)
{
    std::lock_guard lk(mu_);
    auto& e = entries_[endpointId];
    if (e.state == State::Closed) return true;
    const auto now = std::chrono::steady_clock::now();
    const auto elapsed = now - e.openedAt;
    if (e.state == State::Open && elapsed >= cfg_.circuitCooldown)
    {
        e.state = State::HalfOpen;
        return true;
    }
    if (e.state == State::HalfOpen) return false;
    return false;
}

void CircuitBreaker::recordSuccess(std::int64_t endpointId)
{
    std::lock_guard lk(mu_);
    auto& e = entries_[endpointId];
    e.state = State::Closed;
    e.failures = 0;
}

void CircuitBreaker::recordFailure(std::int64_t endpointId)
{
    std::lock_guard lk(mu_);
    auto& e = entries_[endpointId];
    e.failures += 1;
    if (e.failures >= cfg_.circuitFailThreshold
        || e.state == State::HalfOpen)
    {
        e.state = State::Open;
        e.openedAt = std::chrono::steady_clock::now();
    }
}

}  // namespace nextra::webhooks
