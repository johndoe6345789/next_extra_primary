/**
 * @file AuthService.cpp
 * @brief Implementation of the authentication service.
 */

#include "services/AuthService.h"
#include "utils/JwtUtil.h"

#include <drogon/drogon.h>
#include <drogon/orm/DbClient.h>
#include <fmt/format.h>
#include <spdlog/spdlog.h>

#include <algorithm>
#include <chrono>
#include <random>
#include <regex>
#include <stdexcept>
#include <string>
#include <vector>

// Forward-declare the EmailService so we can send emails
// without creating a hard circular include.
namespace services
{
class EmailService;
} // namespace services

namespace services
{

using namespace drogon;
using namespace drogon::orm;

// ----------------------------------------------------------------
// Private helpers
// ----------------------------------------------------------------

auto AuthService::db() -> DbClientPtr
{
    return drogon::app().getDbClient();
}

auto AuthService::isValidEmail(const std::string& email) -> bool
{
    static const std::regex kPattern(
        R"(^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$)");
    return std::regex_match(email, kPattern);
}

auto AuthService::isValidUsername(const std::string& username) -> bool
{
    if (username.size() < 3 || username.size() > 30) {
        return false;
    }
    return std::ranges::all_of(username, [](char c) {
        return std::isalnum(static_cast<unsigned char>(c)) || c == '_';
    });
}

auto AuthService::isStrongPassword(const std::string& password) -> bool
{
    if (password.size() < 8)
        return false;
    bool hasUpper = false;
    bool hasLower = false;
    bool hasDigit = false;
    for (char c : password) {
        auto uc = static_cast<unsigned char>(c);
        if (std::isupper(uc))
            hasUpper = true;
        if (std::islower(uc))
            hasLower = true;
        if (std::isdigit(uc))
            hasDigit = true;
    }
    return hasUpper && hasLower && hasDigit;
}

auto AuthService::generateRandomToken(std::size_t bytes) -> std::string
{
    std::vector<unsigned char> buf(bytes);
    std::random_device rd;
    std::ranges::generate(
        buf, [&rd]() { return static_cast<unsigned char>(rd() & 0xFF); });
    std::string hex;
    hex.reserve(bytes * 2);
    for (auto b : buf) {
        hex += fmt::format("{:02x}", b);
    }
    return hex;
}

// ----------------------------------------------------------------
// Registration
// ----------------------------------------------------------------

void AuthService::registerUser(const std::string& email,
                               const std::string& username,
                               const std::string& password,
                               const std::string& displayName,
                               Callback onSuccess, ErrCallback onError)
{
    // --- Input validation ---
    if (!isValidEmail(email)) {
        onError(k400BadRequest, "Invalid email format");
        return;
    }
    if (!isValidUsername(username)) {
        onError(k400BadRequest, "Username must be 3-30 alphanumeric "
                                "characters");
        return;
    }
    if (!isStrongPassword(password)) {
        onError(k400BadRequest, "Password must be at least 8 characters "
                                "with upper, lower, and digit");
        return;
    }

    auto dbClient = db();
    auto confirmToken = generateRandomToken();

    // Hash password with Drogon's built-in bcrypt.
    auto hashed = drogon::utils::getMd5(password);
    // NOTE: production should use bcrypt via a dedicated
    // PasswordHash utility; MD5 is a placeholder.

    const std::string sql = R"(
        INSERT INTO users
            (email, username, password_hash,
             display_name, email_confirm_token,
             created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        RETURNING id, email, username, display_name,
                  email_confirmed, created_at
    )";

    auto display = displayName.empty() ? username : displayName;

    *dbClient << sql << email << username << hashed << display
              << confirmToken >>
        [onSuccess, email, username, confirmToken](const Result& result) {
            if (result.empty()) {
                onSuccess({{"error", "Insert returned "
                                     "no rows"}});
                return;
            }
            const auto& row = result[0];
            json user = {
                {"id", row["id"].as<std::string>()},
                {"email", row["email"].as<std::string>()},
                {"username", row["username"].as<std::string>()},
                {"display_name", row["display_name"].as<std::string>()},
                {"email_confirmed", false},
                {"created_at", row["created_at"].as<std::string>()}};

            spdlog::info("User registered: {} ({})", username, email);

            // Fire-and-forget: send welcome email
            // (handled by EmailService in production).

            onSuccess(user);
        } >>
        [onError](const DrogonDbException& e) {
            std::string msg = e.base().what();
            if (msg.find("users_email_key") != std::string::npos) {
                onError(k409Conflict, "Email is already registered");
            } else if (msg.find("users_username_key") != std::string::npos) {
                onError(k409Conflict, "Username is already taken");
            } else {
                spdlog::error("registerUser DB error: {}", msg);
                onError(k500InternalServerError, "Internal server error");
            }
        };
}

// ----------------------------------------------------------------
// Login
// ----------------------------------------------------------------

void AuthService::loginUser(const std::string& email,
                            const std::string& password, Callback onSuccess,
                            ErrCallback onError)
{
    if (email.empty() || password.empty()) {
        onError(k400BadRequest, "Email and password are required");
        return;
    }

    auto dbClient = db();
    const std::string sql = R"(
        SELECT id, email, username, display_name,
               password_hash, email_confirmed, role
        FROM users
        WHERE email = $1
        LIMIT 1
    )";

    *dbClient << sql << email >> [onSuccess, onError,
                                  password](const Result& result) {
        if (result.empty()) {
            onError(k401Unauthorized, "Invalid email or password");
            return;
        }
        const auto& row = result[0];
        auto storedHash = row["password_hash"].as<std::string>();

        // Verify password hash.
        auto inputHash = drogon::utils::getMd5(password);
        if (inputHash != storedHash) {
            onError(k401Unauthorized, "Invalid email or password");
            return;
        }

        if (!row["email_confirmed"].as<bool>()) {
            onError(k403Forbidden, "Please confirm your email");
            return;
        }

        auto userId = row["id"].as<std::string>();
        auto role = row["role"].as<std::string>();

        auto accessToken = ::utils::generateAccessToken(userId, role);
        auto refreshToken = ::utils::generateRefreshToken(userId);

        json user = {{"id", userId},
                     {"email", row["email"].as<std::string>()},
                     {"username", row["username"].as<std::string>()},
                     {"display_name", row["display_name"].as<std::string>()},
                     {"role", role}};

        json payload = {{"accessToken", accessToken},
                        {"refreshToken", refreshToken},
                        {"user", user}};

        spdlog::info("User logged in: {}", userId);
        onSuccess(payload);
    } >> [onError](const DrogonDbException& e) {
        spdlog::error("loginUser DB error: {}", e.base().what());
        onError(k500InternalServerError, "Internal server error");
    };
}

// ----------------------------------------------------------------
// Token refresh
// ----------------------------------------------------------------

void AuthService::refreshAccessToken(const std::string& refreshToken,
                                     Callback onSuccess, ErrCallback onError)
{
    try {
        auto claims = ::utils::verifyToken(refreshToken);
        if (!claims.isRefresh) {
            onError(k401Unauthorized, "Invalid token");
            return;
        }

        // Check blocklist first.
        // For simplicity we do a sync-style call here;
        // a production implementation would chain the
        // async DB check.
        auto dbClient = db();
        const std::string sql = R"(
            SELECT 1 FROM token_blocklist
            WHERE jti = $1
            LIMIT 1
        )";

        *dbClient << sql << refreshToken >> [onSuccess, onError,
                                             claims](const Result& result) {
            if (!result.empty()) {
                onError(k401Unauthorized, "Token has been revoked");
                return;
            }

            // Fetch role for the new access token.
            auto dbInner = drogon::app().getDbClient();
            const std::string roleSql = R"(
                    SELECT role FROM users
                    WHERE id = $1
                )";

            *dbInner << roleSql << claims.userId >> [onSuccess, onError,
                                                     claims](const Result& r2) {
                std::string role = "user";
                if (!r2.empty()) {
                    role = r2[0]["role"].as<std::string>();
                }
                auto newToken =
                    ::utils::generateAccessToken(claims.userId, role);
                onSuccess({{"accessToken", newToken}});
            } >> [onError](const DrogonDbException& e) {
                spdlog::error("refreshAccessToken DB "
                              "error: {}",
                              e.base().what());
                onError(k500InternalServerError, "Internal server error");
            };
        } >> [onError](const DrogonDbException& e) {
            spdlog::error("refreshAccessToken blocklist "
                          "check error: {}",
                          e.base().what());
            onError(k500InternalServerError, "Internal server error");
        };
    } catch (const std::exception& ex) {
        onError(k401Unauthorized, "Invalid token");
    }
}

// ----------------------------------------------------------------
// Logout
// ----------------------------------------------------------------

void AuthService::logoutUser(const std::string& jti, Callback onSuccess,
                             ErrCallback onError)
{
    auto dbClient = db();
    const std::string sql = R"(
        INSERT INTO token_blocklist (jti, blocked_at)
        VALUES ($1, NOW())
        ON CONFLICT (jti) DO NOTHING
    )";

    *dbClient << sql << jti >> [onSuccess](const Result&) {
        spdlog::info("Token blocked: (jti)");
        onSuccess(json::object());
    } >> [onError](const DrogonDbException& e) {
        spdlog::error("logoutUser DB error: {}", e.base().what());
        onError(k500InternalServerError, "Internal server error");
    };
}

// ----------------------------------------------------------------
// Email confirmation
// ----------------------------------------------------------------

void AuthService::confirmEmail(const std::string& token, Callback onSuccess,
                               ErrCallback onError)
{
    auto dbClient = db();
    const std::string sql = R"(
        UPDATE users
        SET email_confirmed = true,
            email_confirm_token = NULL,
            updated_at = NOW()
        WHERE email_confirm_token = $1
          AND email_confirmed = false
        RETURNING id
    )";

    *dbClient << sql << token >> [onSuccess, onError](const Result& result) {
        if (result.empty()) {
            onError(k400BadRequest, "Invalid or expired "
                                    "confirmation token");
            return;
        }
        spdlog::info("Email confirmed for user {}",
                     result[0]["id"].as<std::string>());
        onSuccess({{"confirmed", true}});
    } >> [onError](const DrogonDbException& e) {
        spdlog::error("confirmEmail DB error: {}", e.base().what());
        onError(k500InternalServerError, "Internal server error");
    };
}

// ----------------------------------------------------------------
// Password reset - request
// ----------------------------------------------------------------

void AuthService::requestPasswordReset(const std::string& email,
                                       Callback onSuccess, ErrCallback onError)
{
    auto resetToken = generateRandomToken();
    auto dbClient = db();

    const std::string sql = R"(
        UPDATE users
        SET password_reset_token = $1,
            password_reset_expires = NOW()
                + INTERVAL '1 hour',
            updated_at = NOW()
        WHERE email = $2
        RETURNING id, username
    )";

    *dbClient << sql << resetToken << email >> [onSuccess, email, resetToken](
                                                   const Result& result) {
        // Always report success to avoid leaking
        // account existence.
        if (!result.empty()) {
            spdlog::info("Password reset requested for {}", email);
            // In production: EmailService
            //   ::sendPasswordResetEmail(
            //       email, resetToken);
        }
        onSuccess({{"message", "If the email exists, a reset link "
                               "has been sent"}});
    } >> [onSuccess, onError](const DrogonDbException& e) {
        spdlog::error("requestPasswordReset DB error: {}", e.base().what());
        // Still return success externally.
        onSuccess({{"message", "If the email exists, a reset link "
                               "has been sent"}});
    };
}

// ----------------------------------------------------------------
// Password reset - execute
// ----------------------------------------------------------------

void AuthService::resetPassword(const std::string& token,
                                const std::string& newPassword,
                                Callback onSuccess, ErrCallback onError)
{
    if (!isStrongPassword(newPassword)) {
        onError(k400BadRequest, "Password must be at least 8 characters "
                                "with upper, lower, and digit");
        return;
    }

    auto hashed = drogon::utils::getMd5(newPassword);
    auto dbClient = db();

    const std::string sql = R"(
        UPDATE users
        SET password_hash = $1,
            password_reset_token = NULL,
            password_reset_expires = NULL,
            updated_at = NOW()
        WHERE password_reset_token = $2
          AND password_reset_expires > NOW()
        RETURNING id
    )";

    *dbClient << sql << hashed << token >> [onSuccess,
                                            onError](const Result& result) {
        if (result.empty()) {
            onError(k400BadRequest, "Invalid or expired "
                                    "reset token");
            return;
        }
        spdlog::info("Password reset for user {}",
                     result[0]["id"].as<std::string>());
        onSuccess({{"reset", true}});
    } >> [onError](const DrogonDbException& e) {
        spdlog::error("resetPassword DB error: {}", e.base().what());
        onError(k500InternalServerError, "Internal server error");
    };
}

// ----------------------------------------------------------------
// Token blocklist check
// ----------------------------------------------------------------

void AuthService::isTokenBlocked(const std::string& jti,
                                 std::function<void(bool)> callback)
{
    auto dbClient = db();
    const std::string sql = R"(
        SELECT 1 FROM token_blocklist
        WHERE jti = $1
        LIMIT 1
    )";

    *dbClient << sql << jti >> [callback](const Result& result) {
        callback(!result.empty());
    } >> [callback](const DrogonDbException& e) {
        spdlog::error("isTokenBlocked DB error: {}", e.base().what());
        // Fail-safe: treat as blocked.
        callback(true);
    };
}

} // namespace services
