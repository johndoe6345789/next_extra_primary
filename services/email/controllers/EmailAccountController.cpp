/// @file EmailAccountController.cpp
#include "EmailAccountController.h"
#include "email/backend/EmailAccountService.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;

namespace controllers
{

void EmailAccountController::list(
    const drogon::HttpRequestPtr& req,
    Cb&& cb)
{
    auto userId = req->getAttributes()
        ->get<std::string>("user_id");

    services::EmailAccountService svc;
    svc.listAccounts(userId,
        [cb](const auto& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](auto code, const auto& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

void EmailAccountController::create(
    const drogon::HttpRequestPtr& req,
    Cb&& cb)
{
    auto userId = req->getAttributes()
        ->get<std::string>("user_id");

    auto body = json::parse(
        req->bodyData(),
        req->bodyData() + req->bodyLength(),
        nullptr, false);
    if (body.is_discarded()) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "Invalid JSON"));
        return;
    }

    services::EmailAccountService svc;
    svc.createAccount(userId, body,
        [cb](const auto& data) {
            cb(::utils::jsonCreated(data));
        },
        [cb](auto code, const auto& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

} // namespace controllers
