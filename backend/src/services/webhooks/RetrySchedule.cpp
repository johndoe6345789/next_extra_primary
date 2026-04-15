/**
 * @file RetrySchedule.cpp
 * @brief Exponential backoff with bounded jitter.
 */

#include "services/webhooks/RetrySchedule.h"

#include <algorithm>
#include <cmath>
#include <random>

namespace nextra::webhooks
{

static double randomJitter(double ratio)
{
    static thread_local std::mt19937_64 rng{std::random_device{}()};
    std::uniform_real_distribution<double> dist(-ratio, ratio);
    return dist(rng);
}

std::chrono::milliseconds nextRetryDelay(const DispatcherConfig& cfg,
                                         int attempts)
{
    if (attempts < 1) attempts = 1;
    const double factor = std::pow(2.0, attempts - 1);
    const double base = static_cast<double>(cfg.baseDelay.count());
    const double uncapped = base * factor;
    const double capped = std::min(
        uncapped,
        static_cast<double>(cfg.maxDelay.count()));
    const double jittered = capped * (1.0 + randomJitter(cfg.jitterRatio));
    const auto ms = static_cast<std::int64_t>(
        std::max(jittered, static_cast<double>(cfg.baseDelay.count())));
    return std::chrono::milliseconds{ms};
}

bool isExhausted(const DispatcherConfig& cfg, int attempts)
{
    return attempts >= cfg.maxAttempts;
}

}  // namespace nextra::webhooks
