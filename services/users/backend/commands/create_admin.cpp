/**
 * @file create_admin.cpp
 * @brief Implementation of the create-admin sub-command.
 * @copyright 2024 Nextra Contributors
 */

#include "create_admin.h"

#include <fmt/core.h>
#include <spdlog/spdlog.h>

#include <string>

namespace commands
{

void cmdCreateAdmin(const std::string& email, const std::string& password)
{
    spdlog::info("Creating admin account for: {}", email);

    /// @todo Hash password with bcrypt / argon2,
    ///       insert user row with role = 'admin'.

    fmt::print("create-admin: not yet implemented\n");
}

} // namespace commands
