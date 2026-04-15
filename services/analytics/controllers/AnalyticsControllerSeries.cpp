/**
 * @file AnalyticsControllerSeries.cpp
 * @brief GET /api/analytics/series handler.
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

void AnalyticsController::series(
    const HttpRequestPtr& req, Cb&& cb)
{
    if (!requireAdmin(req, cb)) return;

    const std::string key =
        req->getParameter("key");
    int days = 0;
    try {
        days = std::stoi(
            req->getParameter("days"));
    } catch (...) { days = 0; }

    if (key.empty()) {
        cb(::utils::jsonError(
            k400BadRequest,
            "Missing 'key' query parameter",
            "VAL_010"));
        return;
    }

    auto cfg = loadAnalyticsConfig();
    MetricsCollector collector(cfg);
    TimeSeries ts(
        collector,
        cfg.value("seriesDefaultDays", 30),
        cfg.value("seriesMaxDays", 180));

    auto db = app().getDbClient();
    auto s = ts.build(db, key, days);
    if (!s.has_value()) {
        cb(::utils::jsonError(
            k404NotFound,
            "Unknown metric key",
            "ANL_404"));
        return;
    }

    json points = json::array();
    for (const auto& p : s->points) {
        points.push_back({
            {"day", p.day},
            {"count", p.count}});
    }
    cb(::utils::jsonOk({
        {"key", s->key},
        {"label", s->label},
        {"missing", s->missing},
        {"points", points},
    }));
}

} // namespace controllers
