/**
 * @file webhook_dispatcher.h
 * @brief CLI subcommand that runs the webhook-dispatcher daemon.
 */

#pragma once

#include <string>

namespace commands
{

/**
 * @brief Run the webhook dispatcher daemon.
 *
 * Loads @c constants/webhook-dispatcher.json for tuning, starts a
 * WebhookDispatcher worker thread that claims due rows from
 * webhook_deliveries, POSTs them with HMAC-SHA256 signed bodies,
 * and schedules retries with exponential backoff plus circuit
 * breaking per endpoint.  Also mounts the /api/webhooks controller
 * so the operator tool can CRUD endpoints and replay deliveries.
 *
 * @param config Path to a Drogon JSON config with DB credentials.
 * @throws std::runtime_error if the config or constants file is
 *         missing or malformed.
 */
void cmdWebhookDispatcher(const std::string& config);

}  // namespace commands
