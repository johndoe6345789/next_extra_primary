#pragma once

/**
 * @file RetrySchedule.h
 * @brief Exponential-with-jitter retry schedule.
 *
 * Pure function so it can be unit tested without touching the DB
 * or the clock.  The dispatcher asks this when a delivery fails
 * to compute the next_retry_at timestamp to write back.
 */

#include "webhooks/backend/WebhookTypes.h"

#include <chrono>

namespace nextra::webhooks
{

/**
 * @brief Compute the next retry delay for a failed delivery.
 *
 * Delay = min(maxDelay, baseDelay * 2^(attempts-1)) * (1 +/- jitter).
 *
 * @param cfg Dispatcher config (base delay, max delay, jitter ratio).
 * @param attempts The attempt count AFTER the failure is recorded.
 * @return Wall-clock delay until the next retry should fire.
 */
std::chrono::milliseconds nextRetryDelay(const DispatcherConfig& cfg,
                                         int attempts);

/**
 * @brief True when the delivery has exhausted its attempt budget
 *        and should transition to the "dead" status.
 */
bool isExhausted(const DispatcherConfig& cfg, int attempts);

}  // namespace nextra::webhooks
