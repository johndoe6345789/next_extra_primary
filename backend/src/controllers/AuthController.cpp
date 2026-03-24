/**
 * @file AuthController.cpp
 * @brief Authentication endpoint implementations.
 */

#include "AuthController.h"
#include "../utils/JsonResponse.h"
#include "../utils/JwtUtil.h"
#include "../utils/PasswordHash.h"
#include "../utils/Validators.h"

#include <nlohmann/json.hpp>
#include <mutex>
#include <set>
#include <string>

using json = nlohmann::json;
using Cb   = std::function<void(const drogon::HttpResponsePtr &)>;

namespace controllers {

namespace {
// In-memory blocklist (replace with Redis in production).
std::mutex gBlocklistMutex;
std::set<std::string> gBlockedTokens;
}  // namespace

// ----------------------------------------------------------
void AuthController::registerUser(
    const drogon::HttpRequestPtr &req, Cb &&cb)
{
    auto body = json::parse(req->bodyData(),
                            req->bodyData()
                                + req->bodyLength(),
                            nullptr, false);
    if (body.is_discarded()
        || !body.contains("email")
        || !body.contains("username")
        || !body.contains("password"))
    {
        cb(utils::jsonError(drogon::k400BadRequest,
                            "Missing required fields"));
        return;
    }

    auto email    = body["email"].get<std::string>();
    auto username = body["username"].get<std::string>();
    auto password = body["password"].get<std::string>();

    if (!utils::isValidEmail(email)) {
        cb(utils::jsonError(drogon::k400BadRequest,
                            "Invalid email format"));
        return;
    }
    if (!utils::isValidUsername(username)) {
        cb(utils::jsonError(drogon::k400BadRequest,
                            "Invalid username"));
        return;
    }
    if (!utils::isValidPassword(password)) {
        cb(utils::jsonError(drogon::k400BadRequest,
                            "Password too weak"));
        return;
    }

    auto hashed = utils::hashPassword(password);
    auto displayName = body.value("display_name", username);

    // TODO: persist user to database.
    json user = {
        {"id", "generated-uuid"},
        {"email", email},
        {"username", username},
        {"display_name", displayName}
    };
    cb(utils::jsonCreated(user));
}

// ----------------------------------------------------------
void AuthController::login(
    const drogon::HttpRequestPtr &req, Cb &&cb)
{
    auto body = json::parse(req->bodyData(),
                            req->bodyData()
                                + req->bodyLength(),
                            nullptr, false);
    if (body.is_discarded()
        || !body.contains("email")
        || !body.contains("password"))
    {
        cb(utils::jsonError(drogon::k400BadRequest,
                            "Email and password required"));
        return;
    }

    // TODO: look up user from DB and verify password.
    auto userId = std::string{"user-uuid"};
    auto role   = std::string{"user"};

    auto access  = utils::generateAccessToken(userId, role);
    auto refresh = utils::generateRefreshToken(userId);

    json result = {
        {"access_token",  access},
        {"refresh_token", refresh},
        {"user", {
            {"id", userId},
            {"email", body["email"]},
            {"role", role}
        }}
    };
    cb(utils::jsonOk(result));
}

// ----------------------------------------------------------
void AuthController::logout(
    const drogon::HttpRequestPtr &req, Cb &&cb)
{
    auto auth = req->getHeader("Authorization");
    auto token = auth.substr(7);  // Strip "Bearer ".

    {
        std::lock_guard lock{gBlocklistMutex};
        gBlockedTokens.insert(token);
    }

    cb(utils::jsonOk({{"message", "Logged out"}}));
}

// ----------------------------------------------------------
void AuthController::refresh(
    const drogon::HttpRequestPtr &req, Cb &&cb)
{
    auto body = json::parse(req->bodyData(),
                            req->bodyData()
                                + req->bodyLength(),
                            nullptr, false);
    if (body.is_discarded()
        || !body.contains("refresh_token"))
    {
        cb(utils::jsonError(drogon::k400BadRequest,
                            "refresh_token required"));
        return;
    }

    try {
        auto claims = utils::verifyToken(
            body["refresh_token"].get<std::string>());
        if (!claims.isRefresh) {
            cb(utils::jsonError(drogon::k401Unauthorized,
                                "Not a refresh token"));
            return;
        }
        auto access = utils::generateAccessToken(
            claims.userId, claims.role);
        cb(utils::jsonOk({{"access_token", access}}));
    } catch (const std::exception &ex) {
        cb(utils::jsonError(drogon::k401Unauthorized,
                            ex.what()));
    }
}

// ----------------------------------------------------------
void AuthController::me(
    const drogon::HttpRequestPtr &req, Cb &&cb)
{
    auto userId = req->attributes()->get<std::string>(
        "user_id");
    // TODO: fetch full user from DB.
    json user = {
        {"id", userId},
        {"email", "user@example.com"},
        {"role", req->attributes()->get<std::string>(
                     "user_role")}
    };
    cb(utils::jsonOk(user));
}

// ----------------------------------------------------------
void AuthController::forgotPassword(
    const drogon::HttpRequestPtr &req, Cb &&cb)
{
    auto body = json::parse(req->bodyData(),
                            req->bodyData()
                                + req->bodyLength(),
                            nullptr, false);
    if (body.is_discarded() || !body.contains("email")) {
        cb(utils::jsonError(drogon::k400BadRequest,
                            "Email required"));
        return;
    }
    // TODO: generate token and send email.
    cb(utils::jsonOk(
        {{"message",
          "If the email exists, a reset link was sent"}}));
}

// ----------------------------------------------------------
void AuthController::resetPassword(
    const drogon::HttpRequestPtr &req, Cb &&cb,
    const std::string &token)
{
    auto body = json::parse(req->bodyData(),
                            req->bodyData()
                                + req->bodyLength(),
                            nullptr, false);
    if (body.is_discarded()
        || !body.contains("password"))
    {
        cb(utils::jsonError(drogon::k400BadRequest,
                            "New password required"));
        return;
    }
    if (!utils::isValidPassword(
            body["password"].get<std::string>()))
    {
        cb(utils::jsonError(drogon::k400BadRequest,
                            "Password too weak"));
        return;
    }
    // TODO: validate token and update password in DB.
    cb(utils::jsonOk(
        {{"message", "Password has been reset"}}));
}

// ----------------------------------------------------------
void AuthController::confirmEmail(
    const drogon::HttpRequestPtr & /*req*/, Cb &&cb,
    const std::string &token)
{
    // TODO: validate confirmation token in DB.
    cb(utils::jsonOk(
        {{"message", "Email confirmed successfully"}}));
}

}  // namespace controllers
