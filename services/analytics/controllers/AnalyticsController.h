#pragma once
/**
 * @file AnalyticsController.h
 * @brief Admin analytics HTTP controller.
 *
 * Routes:
 *   GET /api/analytics/summary  — metric totals
 *   GET /api/analytics/series   — daily series
 *
 * Both endpoints require a JWT with role=admin.
 */

#include <drogon/HttpController.h>

namespace controllers
{

class AnalyticsController
    : public drogon::HttpController<
          AnalyticsController>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(
        AnalyticsController::summary,
        "/api/analytics/summary",
        drogon::Get,
        "filters::JwtAuthFilter");
    ADD_METHOD_TO(
        AnalyticsController::series,
        "/api/analytics/series",
        drogon::Get,
        "filters::JwtAuthFilter");
    METHOD_LIST_END

    /** @brief Return totals across all metrics. */
    void summary(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb);

    /** @brief Return a single metric's daily series. */
    void series(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb);
};

} // namespace controllers
