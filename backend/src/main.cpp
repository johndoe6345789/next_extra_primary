/**
 * @file main.cpp
 * @brief Entry point for the nextra-api backend service.
 *
 * Parses CLI arguments via CLI11, then dispatches to
 * the appropriate sub-command handler in commands/.
 *
 * @copyright 2024 Nextra Contributors
 */

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
 * @brief Application entry point.
 *
 * Sets up CLI11 sub-commands and dispatches to the
 * matching handler after parsing.
 *
 * @param argc Argument count.
 * @param argv Argument vector.
 * @return EXIT_SUCCESS on clean shutdown;
 *         EXIT_FAILURE on error.
 */
int main(int argc, char* argv[])
{
    CLI::App app{"nextra-api -- backend service for Nextra"};
    app.require_subcommand(0, 1);

    // -- serve (default) --
    std::uint16_t servePort{8080};
    std::string serveConfig{"config/config.json"};
    auto* serveCmd =
        app.add_subcommand("serve", "Start the HTTP server (default)");
    serveCmd->add_option("-p,--port", servePort, "TCP port to listen on")
        ->default_val(8080);
    serveCmd
        ->add_option("-c,--config", serveConfig, "Path to Drogon JSON config")
        ->default_val("config/config.json");

    // -- migrate --
    bool migrateUp{false};
    bool migrateDown{false};
    bool migrateStatus{false};
    auto* migrateCmd = app.add_subcommand("migrate", "Run database migrations");
    migrateCmd->add_flag("--up", migrateUp, "Apply all pending migrations");
    migrateCmd->add_flag("--down", migrateDown,
                         "Roll back the most recent migration");
    migrateCmd->add_flag("--status", migrateStatus,
                         "Show current migration state");

    // -- seed --
    std::string seedFile;
    auto* seedCmd = app.add_subcommand("seed", "Load seed / fixture data");
    seedCmd->add_option("-f,--file", seedFile,
                        "Path to a specific seed JSON file");

    // -- create-admin --
    std::string adminEmail;
    std::string adminPassword;
    auto* adminCmd =
        app.add_subcommand("create-admin", "Create an administrator account");
    adminCmd->add_option("--email", adminEmail, "Admin e-mail address")
        ->required();
    adminCmd
        ->add_option("--password", adminPassword,
                     "Admin password (will be hashed)")
        ->required();

    CLI11_PARSE(app, argc, argv);

    try {
        if (*migrateCmd) {
            commands::cmdMigrate(migrateUp, migrateDown, migrateStatus);
        } else if (*seedCmd) {
            commands::cmdSeed(seedFile);
        } else if (*adminCmd) {
            commands::cmdCreateAdmin(adminEmail, adminPassword);
        } else {
            commands::cmdServe(servePort, serveConfig);
        }
    } catch (const std::exception& ex) {
        spdlog::error("Fatal: {}", ex.what());
        return EXIT_FAILURE;
    }

    return EXIT_SUCCESS;
}
