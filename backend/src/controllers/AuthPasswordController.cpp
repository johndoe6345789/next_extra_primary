/**
 * @file AuthPasswordController.cpp
 * @brief Password recovery and email confirmation.
 */

#include "AuthPasswordController.h"
#include "../services/AuthService.h"
#include "../utils/JsonResponse.h"
#include "../utils/Validators.h"
#include "auth_password_helpers.h"

#include <nlohmann/json.hpp>
#include <string>

using json = nlohmann::json;

namespace controllers
{

void AuthPasswordController::forgotPassword(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto body = json::parse(
        req->bodyData(),
        req->bodyData() + req->bodyLength(),
        nullptr, false);
    if (body.is_discarded()
        || !body.contains("email")) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "Email required"));
        return;
    }
    services::AuthService auth;
    auth.requestPasswordReset(
        body["email"].get<std::string>(),
        okCb(cb), errCb(cb));
}

void AuthPasswordController::resetPassword(
    const drogon::HttpRequestPtr& req, Cb&& cb,
    const std::string& token)
{
    auto body = json::parse(
        req->bodyData(),
        req->bodyData() + req->bodyLength(),
        nullptr, false);
    if (body.is_discarded()
        || !body.contains("password")) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "New password required"));
        return;
    }
    auto pw = body["password"].get<std::string>();
    if (!::utils::isValidPassword(pw)) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "Password too weak"));
        return;
    }
    services::AuthService auth;
    auth.resetPassword(
        token, pw, okCb(cb), errCb(cb));
}

void AuthPasswordController::confirmEmail(
    const drogon::HttpRequestPtr& /*req*/,
    Cb&& cb,
    const std::string& token)
{
    if (token.empty()) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "Confirmation token required"));
        return;
    }
    services::AuthService auth;
    auth.confirmEmail(
        token, okCb(cb), errCb(cb));
}

} // namespace controllers
