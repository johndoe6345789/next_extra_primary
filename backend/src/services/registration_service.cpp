/** @file registration_service.cpp */
#include "services/registration_service.h"
#include "services/auth_helpers.h"
#include "utils/PasswordHash.h"
#include <drogon/drogon.h>
#include <drogon/orm/DbClient.h>
#include <spdlog/spdlog.h>

namespace services
{
using namespace drogon;
using namespace drogon::orm;

void RegistrationService::registerUser(
    const std::string& email,
    const std::string& username,
    const std::string& password,
    const std::string& displayName,
    Callback onSuccess, ErrCallback onError)
{
    if (!isValidAuthEmail(email)) {
        onError(k400BadRequest, "Invalid email format");
        return;
    }
    if (!isValidAuthUsername(username)) {
        onError(k400BadRequest,
                "Username must be 3-30 alphanumeric "
                "characters");
        return;
    }
    if (!isStrongAuthPassword(password)) {
        onError(k400BadRequest,
                "Password must be at least 8 chars "
                "with upper, lower, and digit");
        return;
    }
    auto dbClient = authDb();
    auto token = generateRandomToken();
    auto hashed = ::utils::hashPassword(password);
    auto display =
        displayName.empty() ? username : displayName;
    const std::string sql = R"(
        INSERT INTO users
            (email, username, password_hash,
             display_name, email_confirm_token,
             created_at, updated_at)
        VALUES ($1,$2,$3,$4,$5,NOW(),NOW())
        RETURNING id, email, username,
                  display_name, email_confirmed,
                  created_at
    )";
    *dbClient << sql << email << username << hashed
              << display << token >>
        [onSuccess, onError, username, email](
            const Result& result) {
            if (result.empty()) {
                spdlog::error(
                    "registerUser: INSERT returned"
                    " no rows for {} ({})",
                    username, email);
                onError(k500InternalServerError,
                        "Internal server error");
                return;
            }
            const auto& r = result[0];
            json user = {
                {"id", r["id"].as<std::string>()},
                {"email",
                 r["email"].as<std::string>()},
                {"username",
                 r["username"].as<std::string>()},
                {"displayName",
                 r["display_name"]
                     .as<std::string>()},
                {"emailConfirmed", false},
                {"createdAt",
                 r["created_at"].as<std::string>()}};
            spdlog::info("User registered: {} ({})",
                         username, email);
            onSuccess(user);
        } >>
        [onError](const DrogonDbException& e) {
            std::string msg = e.base().what();
            if (msg.find("users_email_key") !=
                std::string::npos)
                onError(k409Conflict,
                        "Email already registered");
            else if (msg.find("users_username_key") !=
                     std::string::npos)
                onError(k409Conflict,
                        "Username already taken");
            else {
                spdlog::error(
                    "registerUser DB error: {}", msg);
                onError(k500InternalServerError,
                        "Internal server error");
            }
        };
}
} // namespace services
