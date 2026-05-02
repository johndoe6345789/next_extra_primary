/**
 * @file AlertServiceList.cpp
 * @brief Paginated read of the alerts table,
 *        newest-first. Optional status / severity
 *        filters via query params.
 */

#include "alerts/backend/AlertService.h"

#include <drogon/orm/Exception.h>
#include <spdlog/spdlog.h>

#include <format>

namespace nextra::alerts
{

void AlertService::list(
    std::int64_t limit, std::int64_t offset,
    const std::string& statusFilter,
    const std::string& severityFilter,
    OkCb ok, ErrCb err)
{
    if (limit <= 0)   limit = 50;
    if (limit > 500)  limit = 500;
    if (offset < 0)   offset = 0;

    std::string sql =
        "SELECT id, source, severity, message, "
        "       dedupe_key, metadata, first_seen, "
        "       last_seen, count, status, "
        "       acknowledged_by "
        "  FROM alerts WHERE 1=1 ";
    if (!statusFilter.empty()) {
        sql += " AND status = '" + statusFilter + "'";
    }
    if (!severityFilter.empty()) {
        sql += " AND severity = '"
            + severityFilter + "'";
    }
    sql += std::format(
        " ORDER BY last_seen DESC LIMIT {} OFFSET {}",
        limit, offset);

    db_->execSqlAsync(sql,
        [ok](const drogon::orm::Result& rows) {
            json arr = json::array();
            for (const auto& r : rows) {
                json m = json::object();
                try {
                    m = json::parse(
                        r["metadata"].as<std::string>());
                } catch (...) {}
                arr.push_back({
                    {"id",
                       r["id"].as<std::string>()},
                    {"source",
                       r["source"].as<std::string>()},
                    {"severity",
                       r["severity"].as<std::string>()},
                    {"message",
                       r["message"].as<std::string>()},
                    {"dedupe_key",
                       r["dedupe_key"].as<std::string>()},
                    {"metadata", m},
                    {"first_seen",
                       r["first_seen"].as<std::string>()},
                    {"last_seen",
                       r["last_seen"].as<std::string>()},
                    {"count",
                       r["count"].as<std::int64_t>()},
                    {"status",
                       r["status"].as<std::string>()}
                });
            }
            ok(arr);
        },
        [err](const drogon::orm::DrogonDbException& e) {
            spdlog::error("alerts list: {}",
                          e.base().what());
            err(500, e.base().what());
        });
}

} // namespace nextra::alerts
