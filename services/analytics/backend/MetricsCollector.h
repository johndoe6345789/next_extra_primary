#pragma once
/**
 * @file MetricsCollector.h
 * @brief Collect count() totals across tables.
 *
 * Uses pg_class to probe whether a table exists
 * before issuing the count query, so the daemon
 * gracefully degrades when migrations from other
 * phases have not landed yet.
 */

#include "AnalyticsTypes.h"

#include <drogon/orm/DbClient.h>
#include <memory>
#include <nlohmann/json.hpp>

namespace services::analytics
{

/**
 * @class MetricsCollector
 * @brief Aggregates per-table totals for the UI.
 */
class MetricsCollector
{
  public:
    /**
     * @brief Load metric defs from the JSON file.
     * @param cfg Parsed analytics.json content.
     */
    explicit MetricsCollector(
        const nlohmann::json& cfg);

    /**
     * @brief Run count queries against all metrics.
     * @param db Drogon database client.
     * @return Vector of metric results (possibly
     *         flagged missing when a table is gone).
     */
    std::vector<MetricCount> collect(
        const std::shared_ptr<
            drogon::orm::DbClient>& db) const;

    /** @brief Return the parsed metric definitions. */
    const std::vector<MetricDef>& defs() const
    {
        return defs_;
    }

  private:
    std::vector<MetricDef> defs_;
};

} // namespace services::analytics
