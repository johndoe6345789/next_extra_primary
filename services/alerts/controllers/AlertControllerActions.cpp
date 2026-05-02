/**
 * @file AlertControllerActions.cpp
 * @brief Acknowledge / resolve endpoints.
 */

#include "AlertController.h"
#include "alert_controller_helpers.h"

#include "alerts/backend/AlertService.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <nlohmann/json.hpp>

#include <memory>
#include <string>

namespace controllers
{

using namespace controllers::alert_helpers;

void AlertController::acknowledge(
    const drogon::HttpRequestPtr& req,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb,
    const std::string& id)
{
    auto actor = req->getHeader("x-user-id");
    auto svc = std::make_shared<
        nextra::alerts::AlertService>();
    svc->acknowledge(id, actor,
        [cb, svc](nlohmann::json r) {
            cb(::utils::jsonOk(r));
        },
        [cb, svc](int c, std::string m) {
            cb(::utils::jsonError(mapStatus(c), m));
        });
}

void AlertController::resolve(
    const drogon::HttpRequestPtr&,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb,
    const std::string& id)
{
    auto svc = std::make_shared<
        nextra::alerts::AlertService>();
    svc->resolve(id,
        [cb, svc](nlohmann::json r) {
            cb(::utils::jsonOk(r));
        },
        [cb, svc](int c, std::string m) {
            cb(::utils::jsonError(mapStatus(c), m));
        });
}

} // namespace controllers
