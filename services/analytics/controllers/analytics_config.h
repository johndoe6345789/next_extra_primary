#pragma once
/**
 * @file analytics_config.h
 * @brief Shared analytics config loader + helpers
 *        for the summary + series controllers.
 */

#include "analytics/backend/MetricsCollector.h"
#include "analytics/backend/TimeSeries.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <drogon/HttpRequest.h>
#include <drogon/drogon.h>
#include <filesystem>
#include <fstream>
#include <nlohmann/json.hpp>

namespace controllers
{

/** @brief Load analytics.json from the constants dir. */
inline nlohmann::json loadAnalyticsConfig()
{
    namespace fs = std::filesystem;
    const fs::path p =
        "src/constants/analytics.json";
    std::ifstream f(p);
    if (!f.is_open()) return nlohmann::json{};
    nlohmann::json j;
    f >> j;
    return j;
}

/** @brief Reject non-admin callers with 403. */
inline bool requireAdmin(
    const drogon::HttpRequestPtr& req,
    const std::function<void(
        const drogon::HttpResponsePtr&)>& cb)
{
    auto role = req->attributes()
        ->get<std::string>("user_role");
    if (role != "admin") {
        cb(::utils::jsonError(
            drogon::k403Forbidden,
            "Admin access required",
            "ADMIN_001"));
        return false;
    }
    return true;
}

} // namespace controllers
