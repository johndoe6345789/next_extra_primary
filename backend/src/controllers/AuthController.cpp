/**
 * @file AuthController.cpp
 * @brief Authentication endpoint implementations.
 */

#include "AuthController.h"
#include "../services/AuthService.h"
#include "../utils/JsonResponse.h"
#include "../utils/JwtUtil.h"
#include "../utils/PasswordHash.h"
#include "../utils/Validators.h"

#include <nlohmann/json.hpp>
#include <string>

using json = nlohmann::json;
using Cb = std::function<void(const drogon::HttpResponsePtr&)>;

namespace controllers
{

// ----------------------------------------------------------
void AuthController::registerUser(const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto body = json::parse(
        req->bodyData(), req->bodyData() + req->bodyLength(), nullptr, false);
    if (body.is_discarded() || !body.contains("email") ||
        !body.contains("username") || !body.contains("password")) {
        cb(::utils::jsonError(drogon::k400BadRequest,
                              "Missing required fields"));
        return;
    }

    auto email = body["email"].get<std::string>();
    auto username = body["username"].get<std::string>();
    auto password = body["password"].get<std::string>();

    if (!::utils::isValidEmail(email)) {
        cb(::utils::jsonError(drogon::k400BadRequest, "Invalid email format"));
        return;
    }
    if (!::utils::isValidUsername(username)) {
        cb(::utils::jsonError(drogon::k400BadRequest, "Invalid username"));
        return;
    }
    if (!::utils::isValidPassword(password)) {
        cb(::utils::jsonError(drogon::k400BadRequest, "Password too weak"));
        return;
    }

    auto hashed = ::utils::hashPassword(password);
    auto displayName = body.value("display_name", username);

    // TODO: persist user to database.
    json user = {{"id", "generated-uuid"},
                 {"email", email},
                 {"username", username},
                 {"display_name", displayName}};
    cb(::utils::jsonCreated(user));
}

// ----------------------------------------------------------
void AuthController::login(const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto body = json::parse(
        req->bodyData(), req->bodyData() + req->bodyLength(), nullptr, false);
    if (body.is_discarded() || !body.contains("email") ||
        !body.contains("password")) {
        cb(::utils::jsonError(drogon::k400BadRequest,
                              "Email and password required"));
        return;
    }

    auto email = body["email"].get<std::string>();
    auto password = body["password"].get<std::string>();

    services::AuthService auth;
    auth.loginUser(
        email, password,
        [cb](const services::json& payload) { cb(::utils::jsonOk(payload)); },
        [cb](drogon::HttpStatusCode code, const std::string& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

// ----------------------------------------------------------
/**
 * @brief Invalidate the caller's access token.
 *
 * Extracts the Bearer token from the Authorization header
 * and delegates to AuthService::logoutUser so the token JTI
 * is persisted to the database blocklist.  JwtAuthFilter
 * queries that same table on every subsequent request.
 *
 * @param req HTTP request containing Authorization header.
 * @param cb  Response callback.
 */
void AuthController::logout(const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto authHeader = req->getHeader("Authorization");
    if (authHeader.size() <= 7) {
        cb(::utils::jsonError(drogon::k400BadRequest,
                              "Missing or malformed token"));
        return;
    }
    auto token = authHeader.substr(7); // Strip "Bearer ".

    services::AuthService auth;
    auth.logoutUser(
        token,
        [cb](const services::json&) {
            cb(::utils::jsonOk({{"message", "Logged out"}}));
        },
        [cb](drogon::HttpStatusCode code, const std::string& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

// ----------------------------------------------------------
void AuthController::refresh(const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto body = json::parse(
        req->bodyData(), req->bodyData() + req->bodyLength(), nullptr, false);
    if (body.is_discarded() || !body.contains("refresh_token")) {
        cb(::utils::jsonError(drogon::k400BadRequest,
                              "refresh_token required"));
        return;
    }

    try {
        auto claims =
            ::utils::verifyToken(body["refresh_token"].get<std::string>());
        if (!claims.isRefresh) {
            cb(::utils::jsonError(drogon::k401Unauthorized,
                                  "Not a refresh token"));
            return;
        }
        auto access = ::utils::generateAccessToken(claims.userId, claims.role);
        cb(::utils::jsonOk({{"access_token", access}}));
    } catch (const std::exception& ex) {
        cb(::utils::jsonError(drogon::k401Unauthorized, ex.what()));
    }
}

// ----------------------------------------------------------
void AuthController::me(const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto userId = req->attributes()->get<std::string>("user_id");
    // TODO: fetch full user from DB.
    json user = {{"id", userId},
                 {"email", "user@example.com"},
                 {"role", req->attributes()->get<std::string>("user_role")}};
    cb(::utils::jsonOk(user));
}

// ----------------------------------------------------------
void AuthController::forgotPassword(const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto body = json::parse(
        req->bodyData(), req->bodyData() + req->bodyLength(), nullptr, false);
    if (body.is_discarded() || !body.contains("email")) {
        cb(::utils::jsonError(drogon::k400BadRequest, "Email required"));
        return;
    }
    // TODO: generate token and send email.
    cb(::utils::jsonOk(
        {{"message", "If the email exists, a reset link was sent"}}));
}

// ----------------------------------------------------------
void AuthController::resetPassword(const drogon::HttpRequestPtr& req, Cb&& cb,
                                   const std::string& token)
{
    auto body = json::parse(
        req->bodyData(), req->bodyData() + req->bodyLength(), nullptr, false);
    if (body.is_discarded() || !body.contains("password")) {
        cb(::utils::jsonError(drogon::k400BadRequest, "New password required"));
        return;
    }
    if (!::utils::isValidPassword(body["password"].get<std::string>())) {
        cb(::utils::jsonError(drogon::k400BadRequest, "Password too weak"));
        return;
    }
    // TODO: validate token and update password in DB.
    cb(::utils::jsonOk({{"message", "Password has been reset"}}));
}

// ----------------------------------------------------------
void AuthController::confirmEmail(const drogon::HttpRequestPtr& /*req*/,
                                  Cb&& cb, const std::string& token)
{
    // TODO: validate confirmation token in DB.
    cb(::utils::jsonOk({{"message", "Email confirmed successfully"}}));
}

} // namespace controllers
