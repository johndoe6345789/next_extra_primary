/**
 * @file MetricsCollector.cpp
 * @brief Implementation of the metric aggregator.
 */

#include "MetricsCollector.h"

#include <drogon/orm/Exception.h>
#include <spdlog/spdlog.h>

using namespace drogon::orm;

namespace services::analytics
{

static bool tableExists(
    const std::shared_ptr<DbClient>& db,
    const std::string& table)
{
    try {
        auto r = db->execSqlSync(
            "SELECT 1 FROM pg_class "
            "WHERE relname = $1 LIMIT 1",
            table);
        return !r.empty();
    } catch (const DrogonDbException& e) {
        spdlog::warn(
            "analytics probe failed: {}",
            e.base().what());
        return false;
    }
}

MetricsCollector::MetricsCollector(
    const nlohmann::json& cfg)
{
    for (const auto& m : cfg.value(
             "metrics", nlohmann::json::array())) {
        defs_.push_back(MetricDef{
            m.value("key", ""),
            m.value("table", ""),
            m.value("label", ""),
            m.value("icon", "insights"),
            m.value("timeColumn", "created_at"),
        });
    }
}

std::vector<MetricCount>
MetricsCollector::collect(
    const std::shared_ptr<DbClient>& db) const
{
    std::vector<MetricCount> out;
    out.reserve(defs_.size());
    for (const auto& def : defs_) {
        MetricCount mc{
            def.key, def.label, def.icon, 0, false};
        if (!tableExists(db, def.table)) {
            mc.missing = true;
            out.push_back(mc);
            continue;
        }
        try {
            auto r = db->execSqlSync(
                "SELECT COUNT(*) AS n FROM " +
                def.table);
            if (!r.empty()) {
                mc.total =
                    r[0]["n"].as<int64_t>();
            }
        } catch (const DrogonDbException& e) {
            spdlog::warn(
                "analytics count {} failed: {}",
                def.table, e.base().what());
            mc.missing = true;
        }
        out.push_back(mc);
    }
    return out;
}

} // namespace services::analytics
