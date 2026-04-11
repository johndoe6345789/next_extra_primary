/**
 * @file AuthController.cpp
 * @brief User registration endpoint.
 *
 * Login is in AuthLogin.cpp.
 */

#include "AuthController.h"
#include "../services/AuthService.h"
#include "../utils/JsonResponse.h"

#include <nlohmann/json.hpp>
#include <string>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;

namespace controllers
{

void AuthController::registerUser(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto body = json::parse(
        req->bodyData(),
        req->bodyData() + req->bodyLength(),
        nullptr, false);
    if (body.is_discarded() ||
        !body.contains("email") ||
        !body.contains("username") ||
        !body.contains("password")) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "Missing required fields", "VAL_004"));
        return;
    }

    auto email =
        body["email"].get<std::string>();
    auto username =
        body["username"].get<std::string>();
    auto password =
        body["password"].get<std::string>();
    auto displayName =
        body.value("display_name", username);

    services::AuthService auth;
    auth.registerUser(
        email, username, password, displayName,
        [cb](const services::json& payload) {
            cb(::utils::jsonCreated(payload));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

} // namespace controllers
