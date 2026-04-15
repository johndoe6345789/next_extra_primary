/**
 * @file TimeSeries.cpp
 * @brief Day-bucket series builder implementation.
 */

#include "TimeSeries.h"

#include <drogon/orm/Exception.h>
#include <spdlog/spdlog.h>

using namespace drogon::orm;

namespace services::analytics
{

TimeSeries::TimeSeries(
    const MetricsCollector& collector,
    int defaultDays, int maxDays)
    : collector_(collector)
    , defaultDays_(defaultDays)
    , maxDays_(maxDays)
{
}

static bool tableExists(
    const std::shared_ptr<DbClient>& db,
    const std::string& table)
{
    auto r = db->execSqlSync(
        "SELECT 1 FROM pg_class "
        "WHERE relname = $1 LIMIT 1",
        table);
    return !r.empty();
}

std::optional<MetricSeries> TimeSeries::build(
    const std::shared_ptr<DbClient>& db,
    const std::string& key, int days) const
{
    const MetricDef* def = nullptr;
    for (const auto& d : collector_.defs()) {
        if (d.key == key) { def = &d; break; }
    }
    if (!def) return std::nullopt;

    int window = days > 0 ? days : defaultDays_;
    if (window > maxDays_) window = maxDays_;

    MetricSeries out;
    out.key = def->key;
    out.label = def->label;

    try {
        if (!tableExists(db, def->table)) {
            out.missing = true;
            return out;
        }
        const std::string sql =
            "SELECT to_char(date_trunc('day', " +
            def->timeColumn +
            "), 'YYYY-MM-DD') AS day, "
            "COUNT(*) AS n FROM " + def->table +
            " WHERE " + def->timeColumn +
            " >= NOW() - ($1::int || ' days')"
            "::interval "
            "GROUP BY 1 ORDER BY 1";
        auto r = db->execSqlSync(sql, window);
        for (const auto& row : r) {
            out.points.push_back(SeriesPoint{
                row["day"].as<std::string>(),
                row["n"].as<int64_t>()});
        }
    } catch (const DrogonDbException& e) {
        spdlog::warn(
            "analytics series {} failed: {}",
            def->table, e.base().what());
        out.missing = true;
    }
    return out;
}

} // namespace services::analytics
