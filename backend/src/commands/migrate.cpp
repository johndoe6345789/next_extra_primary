/**
 * @file migrate.cpp
 * @brief Implementation of the migrate sub-command.
 * @copyright 2024 Nextra Contributors
 */

#include "migrate.h"

#include <fmt/core.h>
#include <spdlog/spdlog.h>

namespace commands
{

void cmdMigrate(bool up, bool down, bool status)
{
    if (status) {
        spdlog::info("Checking migration status...");
        /// @todo Query schema_migrations table and
        ///       compare against files in migrations/.
        fmt::print("Migration status: not yet implemented\n");
        return;
    }

    if (down) {
        spdlog::info("Rolling back last migration...");
        /// @todo Execute the most recent migration's
        ///       rollback SQL.
        fmt::print("Rollback: not yet implemented\n");
        return;
    }

    if (up) {
        spdlog::info("Applying pending migrations...");
        /// @todo Walk migrations/ directory, compare
        ///       against schema_migrations, and apply
        ///       each unapplied file in order.
        fmt::print("Migrate up: not yet implemented\n");
        return;
    }

    fmt::print("No action specified.  "
               "Use --up, --down, or --status.\n");
}

} // namespace commands
