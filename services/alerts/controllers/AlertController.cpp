/**
 * @file AlertController.cpp
 * @brief Ingest + list endpoints. Acknowledge / resolve
 *        live in AlertControllerActions.cpp.
 */

#include "AlertController.h"
#include "alert_controller_helpers.h"

#include "alerts/backend/AlertService.h"
#include "drogon-host/backend/utils/JsonResponse.h"
#include "drogon-host/backend/utils/parse_helpers.h"

#include <nlohmann/json.hpp>

#include <memory>
#include <string>

namespace controllers
{

using namespace controllers::alert_helpers;

void AlertController::ingest(
    const drogon::HttpRequestPtr& req,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb)
{
    nlohmann::json body;
    try { body = nlohmann::json::parse(req->getBody()); }
    catch (...) {
        cb(::utils::jsonError(drogon::k400BadRequest,
            "invalid JSON body"));
        return;
    }
    nextra::alerts::Alert a;
    a.source    = body.value("source",     "");
    a.severity  = body.value("severity",   "info");
    a.message   = body.value("message",     "");
    a.dedupeKey = body.value("dedupe_key", "");
    a.metadata  = body.value("metadata",
        nlohmann::json::object());

    if (a.source.empty() || a.message.empty()
        || a.dedupeKey.empty()) {
        cb(::utils::jsonError(drogon::k400BadRequest,
            "source, message, dedupe_key required"));
        return;
    }
    if (!validSeverity(a.severity)) {
        cb(::utils::jsonError(drogon::k400BadRequest,
            "invalid severity"));
        return;
    }

    auto svc = std::make_shared<
        nextra::alerts::AlertService>();
    svc->ingest(a,
        [cb, svc](nlohmann::json r) {
            cb(::utils::jsonCreated(r));
        },
        [cb, svc](int c, std::string m) {
            cb(::utils::jsonError(mapStatus(c), m));
        });
}

void AlertController::list(
    const drogon::HttpRequestPtr& req,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb)
{
    auto limit  = ::utils::safeStoll(
        req->getParameter("limit"),  50);
    auto offset = ::utils::safeStoll(
        req->getParameter("offset"),  0);
    auto sf = req->getParameter("status");
    auto vf = req->getParameter("severity");

    auto svc = std::make_shared<
        nextra::alerts::AlertService>();
    svc->list(limit, offset, sf, vf,
        [cb, svc](nlohmann::json r) {
            cb(::utils::jsonOk(r));
        },
        [cb, svc](int c, std::string m) {
            cb(::utils::jsonError(mapStatus(c), m));
        });
}

} // namespace controllers
