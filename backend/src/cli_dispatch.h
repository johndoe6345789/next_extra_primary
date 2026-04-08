#pragma once

/**
 * @file cli_dispatch.h
 * @brief Dispatches parsed CLI sub-commands
 *        to their handler functions.
 */

#include "cli_options.h"
#include "commands/create_admin.h"
#include "commands/migrate.h"
#include "commands/seed.h"
#include "commands/serve.h"

#include <CLI/CLI.hpp>
#include <spdlog/spdlog.h>

#include <cstdint>
#include <cstdlib>
#include <string>

/**
 * @brief Run the matched sub-command.
 * @param migrateCmd Parsed migrate sub-command.
 * @param seedCmd    Parsed seed sub-command.
 * @param adminCmd   Parsed admin sub-command.
 * @param migrateOpts Migrate option values.
 * @param seedOpts    Seed option values.
 * @param adminOpts   Admin option values.
 * @param port  Serve port.
 * @param config Serve config path.
 * @return EXIT_SUCCESS or EXIT_FAILURE.
 */
inline int dispatchCommand(
    CLI::App* migrateCmd,
    CLI::App* seedCmd,
    CLI::App* adminCmd,
    const MigrateOpts& migrateOpts,
    const SeedOpts& seedOpts,
    const AdminOpts& adminOpts,
    std::uint16_t port,
    const std::string& config)
{
    try {
        if (*migrateCmd) {
            commands::cmdMigrate(
                migrateOpts.up,
                migrateOpts.down,
                migrateOpts.status);
        } else if (*seedCmd) {
            commands::cmdSeed(seedOpts.file);
        } else if (*adminCmd) {
            commands::cmdCreateAdmin(
                adminOpts.email,
                adminOpts.password);
        } else {
            commands::cmdServe(port, config);
        }
    } catch (const std::exception& ex) {
        spdlog::error(
            "Fatal: {}", ex.what());
        return EXIT_FAILURE;
    }
    return EXIT_SUCCESS;
}
