/**
 * @file HealthController.cpp
 * @brief Health-check endpoint implementation.
 */

#include "HealthController.h"
#include "../utils/JsonResponse.h"

namespace controllers
{

void HealthController::check(
    const drogon::HttpRequestPtr& /*req*/,
    std::function<void(const drogon::HttpResponsePtr&)>&& cb)
{
    nlohmann::json body = {{"status", "ok"}, {"version", "1.0.0"}};
    cb(::utils::jsonOk(body));
}

} // namespace controllers
