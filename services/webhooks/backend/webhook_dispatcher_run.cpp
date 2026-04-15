/**
 * @file webhook_dispatcher_run.cpp
 * @brief Claim / process / write-back helpers for WebhookDispatcher.
 */

#include "webhooks/backend/RetrySchedule.h"
#include "webhooks/backend/WebhookDispatcher.h"

#include <spdlog/spdlog.h>

#include <chrono>

namespace nextra::webhooks
{

std::vector<DeliveryJob> WebhookDispatcher::claimBatch()
{
    std::vector<DeliveryJob> out;
    auto rows = db_->execSqlSync(
        "WITH claimed AS ("
        " SELECT d.id FROM webhook_deliveries d"
        "  WHERE d.status IN ('pending','retrying')"
        "    AND d.next_retry_at <= now()"
        "  ORDER BY d.next_retry_at"
        "  FOR UPDATE SKIP LOCKED LIMIT $1)"
        " UPDATE webhook_deliveries d SET status = 'retrying',"
        "        attempts = d.attempts + 1"
        "  FROM claimed c, webhook_endpoints e"
        "  WHERE d.id = c.id AND e.id = d.endpoint_id AND e.active"
        "  RETURNING d.id, d.endpoint_id, d.event_type,"
        "           d.payload::text, d.attempts, e.url, e.secret",
        static_cast<int>(cfg_.claimBatchSize));
    for (const auto& r : rows)
    {
        DeliveryJob j;
        j.id = r["id"].as<std::int64_t>();
        j.endpointId = r["endpoint_id"].as<std::int64_t>();
        j.eventType = r["event_type"].as<std::string>();
        j.payload = r["payload"].as<std::string>();
        j.attempts = r["attempts"].as<int>();
        j.url = r["url"].as<std::string>();
        j.secret = r["secret"].as<std::string>();
        out.push_back(std::move(j));
    }
    return out;
}

void WebhookDispatcher::processOne(const DeliveryJob& job)
{
    const auto result = client_.send(job);
    if (result.success)
    {
        breaker_.recordSuccess(job.endpointId);
        markDelivered(job.id, result.statusCode);
        return;
    }
    breaker_.recordFailure(job.endpointId);
    markRetry(job, result);
}

void WebhookDispatcher::markDelivered(std::int64_t id, int status)
{
    db_->execSqlSync(
        "UPDATE webhook_deliveries SET status = 'delivered',"
        " last_status_code = $2, delivered_at = now(),"
        " last_error = NULL WHERE id = $1",
        id, status);
    db_->execSqlSync(
        "UPDATE webhook_endpoints e SET failure_streak = 0"
        "  FROM webhook_deliveries d"
        "  WHERE d.id = $1 AND e.id = d.endpoint_id",
        id);
}

void WebhookDispatcher::markRetry(const DeliveryJob& job,
                                  const DeliveryResult& r)
{
    if (isExhausted(cfg_, job.attempts + 1))
    {
        db_->execSqlSync(
            "UPDATE webhook_deliveries SET status = 'dead',"
            " last_status_code = $2, last_error = $3 WHERE id = $1",
            job.id, r.statusCode, r.error);
        return;
    }
    const auto delay = nextRetryDelay(cfg_, job.attempts + 1);
    db_->execSqlSync(
        "UPDATE webhook_deliveries SET status = 'pending',"
        " next_retry_at = now() + ($2 || ' milliseconds')::interval,"
        " last_status_code = $3, last_error = $4 WHERE id = $1",
        job.id, std::to_string(delay.count()), r.statusCode, r.error);
    db_->execSqlSync(
        "UPDATE webhook_endpoints e SET failure_streak ="
        " failure_streak + 1 FROM webhook_deliveries d"
        "  WHERE d.id = $1 AND e.id = d.endpoint_id",
        job.id);
}

}  // namespace nextra::webhooks
