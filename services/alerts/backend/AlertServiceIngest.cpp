/**
 * @file AlertServiceIngest.cpp
 * @brief UPSERT one alert row keyed by
 *        (source, dedupe_key, status='open').
 */

#include "alerts/backend/AlertService.h"

#include <drogon/orm/Exception.h>
#include <spdlog/spdlog.h>

namespace nextra::alerts
{

void AlertService::ingest(
    const Alert& a, OkCb ok, ErrCb err)
{
    static const char* kSql =
        "INSERT INTO alerts "
        "  (source, severity, message, dedupe_key, "
        "   metadata, status) "
        "VALUES ($1, $2, $3, $4, $5::jsonb, 'open') "
        "ON CONFLICT (source, dedupe_key, status) "
        "DO UPDATE SET "
        "  last_seen  = now(), "
        "  count      = alerts.count + 1, "
        "  message    = EXCLUDED.message, "
        "  severity   = EXCLUDED.severity, "
        "  metadata   = EXCLUDED.metadata, "
        "  updated_at = now() "
        "RETURNING id, count";

    auto meta = a.metadata.is_null()
        ? std::string("{}") : a.metadata.dump();

    db_->execSqlAsync(kSql,
        [ok](const drogon::orm::Result& r) {
            json out = {
                {"id",    r[0]["id"].as<std::string>()},
                {"count", r[0]["count"].as<std::int64_t>()}
            };
            ok(out);
        },
        [err](const drogon::orm::DrogonDbException& e) {
            spdlog::error("alerts ingest: {}",
                          e.base().what());
            err(500, e.base().what());
        },
        a.source, a.severity, a.message,
        a.dedupeKey, meta);
}

} // namespace nextra::alerts
