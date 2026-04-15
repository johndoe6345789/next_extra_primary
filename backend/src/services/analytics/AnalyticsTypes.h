#pragma once
/**
 * @file AnalyticsTypes.h
 * @brief POD types for the admin analytics daemon.
 *
 * Declared in a small header so MetricsCollector,
 * TimeSeries, and AnalyticsController share one
 * vocabulary without a cross-include cycle.
 */

#include <cstdint>
#include <string>
#include <vector>

namespace services::analytics
{

/** @brief Single metric definition loaded from JSON. */
struct MetricDef
{
    std::string key;
    std::string table;
    std::string label;
    std::string icon;
    std::string timeColumn;
};

/** @brief Count result for a metric snapshot. */
struct MetricCount
{
    std::string key;
    std::string label;
    std::string icon;
    int64_t total{0};
    bool missing{false};
};

/** @brief One (day, count) point on a time series. */
struct SeriesPoint
{
    std::string day; // ISO YYYY-MM-DD
    int64_t count{0};
};

/** @brief A metric's daily time series. */
struct MetricSeries
{
    std::string key;
    std::string label;
    bool missing{false};
    std::vector<SeriesPoint> points;
};

} // namespace services::analytics
