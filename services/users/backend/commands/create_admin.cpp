/**
 * @file create_admin.cpp
 * @brief Implementation of the create-admin sub-command.
 * @copyright 2024 Nextra Contributors
 */

#include "create_admin.h"
#include "admin_identity.h"
#include "auth/backend/auth_helpers.h"
#include "drogon-host/backend/commands/command_runtime.h"
#include "drogon-host/backend/utils/PasswordHash.h"

#include <drogon/drogon.h>
#include <fmt/core.h>
#include <spdlog/spdlog.h>

#include <stdexcept>

namespace commands
{

namespace
{

auto nextUsername(const drogon::orm::DbClientPtr& db,
                  const std::string& email) -> std::string
{
    auto base = admin::usernameFromEmail(email);
    for (int suffix = 0; suffix < 100; ++suffix) {
        auto suffixText = suffix == 0
            ? std::string{}
            : "_" + std::to_string(suffix);
        auto maxBaseLen = 30 - suffixText.size();
        auto name = base.substr(0, maxBaseLen) + suffixText;
        if (db->execSqlSync(
                "SELECT 1 FROM users WHERE username = $1 LIMIT 1",
                name).empty()) {
            return name;
        }
    }
    throw std::runtime_error("Unable to allocate admin username");
}

} // namespace

void cmdCreateAdmin(const std::string& email, const std::string& password)
{
    if (!services::isValidAuthEmail(email))
        throw std::runtime_error("Invalid admin email");
    if (!services::isStrongAuthPassword(password))
        throw std::runtime_error("Weak admin password");

    auto config = runtime::resolveConfigPath();
    drogon::app().loadConfigFile(config.string());
    auto db = drogon::app().getDbClient();
    auto hash = utils::hashPassword(password);
    auto existing = db->execSqlSync(
        "SELECT id FROM users WHERE email = $1 LIMIT 1", email);
    if (!existing.empty()) {
        db->execSqlSync(
            "UPDATE users SET password_hash = $1, role = 'admin',"
            " email_confirmed = TRUE, updated_at = NOW()"
            " WHERE email = $2",
            hash, email);
        spdlog::info("Promoted existing user to admin: {}", email);
        fmt::print("Updated admin {}\n", email);
        return;
    }

    auto username = nextUsername(db, email);
    db->execSqlSync(
        "INSERT INTO users (email, username, password_hash,"
        " display_name, email_confirmed, role, created_at, updated_at)"
        " VALUES ($1,$2,$3,$4,TRUE,'admin',NOW(),NOW())",
        email, username, hash, username);
    spdlog::info("Created admin account for: {}", email);
    fmt::print("Created admin {} ({})\n", username, email);
}

} // namespace commands
