/**
 * @file FlagsControllerPublic.cpp
 * @brief Public evaluate endpoint for feature flags.
 */

#include "FlagsController.h"
#include "flags_controller_json.h"
#include "feature-flags/backend/FlagEvaluator.h"
#include "feature-flags/backend/FlagStore.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <drogon/drogon.h>
#include <spdlog/spdlog.h>

using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;
using namespace drogon;

namespace controllers
{

void FlagsController::evaluate(
    const HttpRequestPtr& req, Cb&& cb)
{
    const auto key = req->getParameter("key");
    const auto user = req->getParameter("user");
    if (key.empty()) {
        cb(::utils::jsonError(
            k400BadRequest, "key is required"));
        return;
    }
    try {
        services::flags::FlagStore store;
        auto flag = store.findByKey(key);
        if (!flag) {
            cb(::utils::jsonOk({
                {"key", key},
                {"enabled", false},
                {"reason", "unknown"},
            }));
            return;
        }
        auto result =
            services::flags::FlagEvaluator::evaluate(
                *flag, user);
        cb(::utils::jsonOk({
            {"key", result.key},
            {"enabled", result.enabled},
            {"reason", result.reason},
            {"rollout_pct", flag->rolloutPct},
        }));
    } catch (const std::exception& e) {
        spdlog::error("flags evaluate: {}", e.what());
        cb(::utils::jsonError(
            k500InternalServerError, "evaluate failed"));
    }
}

} // namespace controllers
