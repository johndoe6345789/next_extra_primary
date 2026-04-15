/**
 * @file RateLimitDemoController.cpp
 * @brief Implementation of the /api/ratelimit/ping demo.
 */

#include "controllers/RateLimitDemoController.h"
#include "utils/JsonResponse.h"

#include <nlohmann/json.hpp>

namespace nextra::controllers
{

void RateLimitDemoController::ping(
    const drogon::HttpRequestPtr& /*req*/,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb)
{
    nlohmann::json body = {
        {"ok", true},
        {"service", "ratelimit-demo"}};
    cb(::utils::jsonOk(body));
}

} // namespace nextra::controllers
