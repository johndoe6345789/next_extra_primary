/**
 * @file AnalyticsControllerSummary.cpp
 * @brief GET /api/analytics/summary handler.
 */

#include "AnalyticsController.h"
#include "analytics_config.h"

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;
using namespace drogon;
using namespace services::analytics;

namespace controllers
{

void AnalyticsController::summary(
    const HttpRequestPtr& req, Cb&& cb)
{
    if (!requireAdmin(req, cb)) return;

    auto cfg = loadAnalyticsConfig();
    MetricsCollector collector(cfg);

    auto db = app().getDbClient();
    std::vector<MetricCount> counts;
    try {
        counts = collector.collect(db);
    } catch (const std::exception& e) {
        spdlog::error(
            "analytics summary: {}", e.what());
        cb(::utils::jsonError(
            k500InternalServerError,
            "Internal server error"));
        return;
    }

    json metrics = json::array();
    for (const auto& c : counts) {
        metrics.push_back({
            {"key", c.key},
            {"label", c.label},
            {"icon", c.icon},
            {"total", c.total},
            {"missing", c.missing},
        });
    }
    cb(::utils::jsonOk({
        {"retentionDays",
         cfg.value("retentionDays", 90)},
        {"metrics", metrics},
    }));
}

} // namespace controllers
