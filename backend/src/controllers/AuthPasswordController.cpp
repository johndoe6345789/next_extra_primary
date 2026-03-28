/**
 * @file AuthPasswordController.cpp
 * @brief Password recovery and email confirmation endpoints.
 */

#include "AuthPasswordController.h"
#include "../utils/JsonResponse.h"
#include "../utils/Validators.h"

#include <nlohmann/json.hpp>
#include <string>

using json = nlohmann::json;
using Cb = std::function<void(const drogon::HttpResponsePtr&)>;

namespace controllers
{

void AuthPasswordController::forgotPassword(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto body = json::parse(
        req->bodyData(),
        req->bodyData() + req->bodyLength(),
        nullptr, false);
    if (body.is_discarded() || !body.contains("email")) {
        cb(::utils::jsonError(drogon::k400BadRequest,
                              "Email required"));
        return;
    }
    // TODO: generate token and send email.
    cb(::utils::jsonOk({{"message",
        "If the email exists, a reset link was sent"}}));
}

// ----------------------------------------------------------
void AuthPasswordController::resetPassword(
    const drogon::HttpRequestPtr& req, Cb&& cb,
    const std::string& token)
{
    auto body = json::parse(
        req->bodyData(),
        req->bodyData() + req->bodyLength(),
        nullptr, false);
    if (body.is_discarded() || !body.contains("password")) {
        cb(::utils::jsonError(drogon::k400BadRequest,
                              "New password required"));
        return;
    }
    if (!::utils::isValidPassword(
            body["password"].get<std::string>())) {
        cb(::utils::jsonError(drogon::k400BadRequest,
                              "Password too weak"));
        return;
    }
    // TODO: validate token and update password in DB.
    cb(::utils::jsonOk(
        {{"message", "Password has been reset"}}));
}

// ----------------------------------------------------------
void AuthPasswordController::confirmEmail(
    const drogon::HttpRequestPtr& /*req*/, Cb&& cb,
    const std::string& token)
{
    // TODO: validate confirmation token in DB.
    cb(::utils::jsonOk(
        {{"message", "Email confirmed successfully"}}));
}

} // namespace controllers
