/**
 * @file AdminEmailController.cpp
 * @brief Send a test email (admin only).
 */

#include "AdminEmailController.h"
#include "../services/EmailService.h"
#include "../utils/JsonResponse.h"

#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

#include <string>
#include <thread>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;

namespace controllers
{

void AdminEmailController::sendTest(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto role = req->getAttributes()
        ->get<std::string>("user_role");
    if (role != "admin") {
        cb(::utils::jsonError(
            drogon::k403Forbidden, "Admin only"));
        return;
    }

    auto body = json::parse(
        req->bodyData(),
        req->bodyData() + req->bodyLength(),
        nullptr, false);

    if (body.is_discarded()
        || !body.contains("to")
        || !body.contains("subject")
        || !body.contains("body")) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "to, subject and body required"));
        return;
    }

    auto to = body["to"].get<std::string>();
    auto subj = body["subject"].get<std::string>();
    auto html = body["body"].get<std::string>();

    spdlog::info("Admin test email to {}", to);

    // Detached thread: any uncaught exception would
    // terminate the whole process. Wrap in try/catch.
    std::thread([to, subj, html]() {
        try {
            services::EmailService svc;
            svc.sendEmail(to, subj, html);
        } catch (const std::exception& e) {
            spdlog::error(
                "sendTest email failed: {}",
                e.what());
        } catch (...) {
            spdlog::error(
                "sendTest email failed: unknown");
        }
    }).detach();

    cb(::utils::jsonOk(
        json{{"message", "Test email queued"}}));
}

} // namespace controllers
