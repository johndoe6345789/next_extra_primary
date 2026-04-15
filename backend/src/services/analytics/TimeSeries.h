#pragma once
/**
 * @file TimeSeries.h
 * @brief Day-bucket activity series builder.
 */

#include "AnalyticsTypes.h"
#include "MetricsCollector.h"

#include <drogon/orm/DbClient.h>
#include <memory>
#include <optional>
#include <string>

namespace services::analytics
{

/**
 * @class TimeSeries
 * @brief Builds a per-day count series from the
 *        `created_at` column of a metric's table.
 */
class TimeSeries
{
  public:
    /**
     * @brief Construct a series builder.
     * @param collector Source of metric defs.
     * @param defaultDays Default window size.
     * @param maxDays Upper bound the caller may ask.
     */
    TimeSeries(
        const MetricsCollector& collector,
        int defaultDays,
        int maxDays);

    /**
     * @brief Build one metric's daily series.
     * @param db Drogon DB client.
     * @param key Metric key from constants JSON.
     * @param days Window (clamped to [1, maxDays]).
     * @return Series or nullopt if the metric key
     *         is not defined.
     */
    std::optional<MetricSeries> build(
        const std::shared_ptr<
            drogon::orm::DbClient>& db,
        const std::string& key,
        int days) const;

  private:
    const MetricsCollector& collector_;
    int defaultDays_;
    int maxDays_;
};

} // namespace services::analytics
