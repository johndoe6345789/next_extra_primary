/**
 * @file main.cpp
 * @brief Entry point for the nextra-api backend service.
 *
 * Provides CLI sub-commands via CLI11:
 *   - serve        Start the Drogon HTTP server (default).
 *   - migrate      Run database migrations up / down.
 *   - seed         Load seed data from JSON fixtures.
 *   - create-admin Provision an administrator account.
 *
 * @copyright 2024 Nextra Contributors
 */

#include <CLI/CLI.hpp>
#include <drogon/drogon.h>
#include <fmt/core.h>
#include <spdlog/spdlog.h>

#include <csignal>
#include <cstdlib>
#include <filesystem>
#include <iostream>
#include <string>

namespace fs = std::filesystem;

// -----------------------------------------------------------
// Forward declarations for sub-command handlers
// -----------------------------------------------------------

/**
 * @brief Start the Drogon HTTP server.
 * @param port      TCP port to listen on.
 * @param config    Path to the Drogon JSON config file.
 */
static void cmd_serve(std::uint16_t port, const std::string& config);

/**
 * @brief Run database migrations.
 * @param up     Apply pending migrations.
 * @param down   Roll back the most recent migration.
 * @param status Print current migration state.
 */
static void cmd_migrate(bool up, bool down, bool status);

/**
 * @brief Load seed data into the database.
 * @param file  Optional path to a specific seed file.
 */
static void cmd_seed(const std::string& file);

/**
 * @brief Create an administrator user.
 * @param email    Admin e-mail address.
 * @param password Plain-text password (will be hashed).
 */
static void cmd_create_admin(const std::string& email,
                             const std::string& password);

// -----------------------------------------------------------
// Signal handling
// -----------------------------------------------------------

/// @brief Gracefully shut down Drogon on SIGINT / SIGTERM.
static void signal_handler(int signum)
{
    spdlog::info("Received signal {} -- shutting down gracefully.", signum);
    drogon::app().quit();
}

/// @brief Register POSIX signal handlers.
static void install_signal_handlers()
{
    std::signal(SIGINT, signal_handler);
    std::signal(SIGTERM, signal_handler);
}

// -----------------------------------------------------------
// main
// -----------------------------------------------------------

/**
 * @brief Application entry point.
 *
 * Parses command-line arguments with CLI11, then
 * dispatches to the appropriate sub-command handler.
 *
 * @param argc Argument count.
 * @param argv Argument vector.
 * @return EXIT_SUCCESS on clean shutdown; EXIT_FAILURE
 *         on error.
 */
int main(int argc, char* argv[])
{
    // --------------------------------------------------
    // Root CLI app
    // --------------------------------------------------
    CLI::App app{"nextra-api -- backend service for Nextra"};
    app.require_subcommand(0, 1);

    // --------------------------------------------------
    // serve (default sub-command)
    // --------------------------------------------------
    std::uint16_t serve_port{8080};
    std::string serve_config{"config/config.json"};

    auto* serve_cmd =
        app.add_subcommand("serve", "Start the HTTP server (default)");
    serve_cmd->add_option("-p,--port", serve_port, "TCP port to listen on")
        ->default_val(8080);
    serve_cmd
        ->add_option("-c,--config", serve_config, "Path to Drogon JSON config")
        ->default_val("config/config.json");

    // --------------------------------------------------
    // migrate
    // --------------------------------------------------
    bool migrate_up{false};
    bool migrate_down{false};
    bool migrate_status{false};

    auto* migrate_cmd =
        app.add_subcommand("migrate", "Run database migrations");
    migrate_cmd->add_flag("--up", migrate_up, "Apply all pending migrations");
    migrate_cmd->add_flag("--down", migrate_down,
                          "Roll back the most recent migration");
    migrate_cmd->add_flag("--status", migrate_status,
                          "Show current migration state");

    // --------------------------------------------------
    // seed
    // --------------------------------------------------
    std::string seed_file;

    auto* seed_cmd = app.add_subcommand("seed", "Load seed / fixture data");
    seed_cmd->add_option("-f,--file", seed_file,
                         "Path to a specific seed JSON file");

    // --------------------------------------------------
    // create-admin
    // --------------------------------------------------
    std::string admin_email;
    std::string admin_password;

    auto* admin_cmd =
        app.add_subcommand("create-admin", "Create an administrator account");
    admin_cmd->add_option("--email", admin_email, "Admin e-mail address")
        ->required();
    admin_cmd
        ->add_option("--password", admin_password,
                     "Admin password (will be hashed)")
        ->required();

    // --------------------------------------------------
    // Parse
    // --------------------------------------------------
    CLI11_PARSE(app, argc, argv);

    // --------------------------------------------------
    // Dispatch
    // --------------------------------------------------
    try {
        if (*migrate_cmd) {
            cmd_migrate(migrate_up, migrate_down, migrate_status);
        } else if (*seed_cmd) {
            cmd_seed(seed_file);
        } else if (*admin_cmd) {
            cmd_create_admin(admin_email, admin_password);
        } else {
            // Default: serve
            cmd_serve(serve_port, serve_config);
        }
    } catch (const std::exception& ex) {
        spdlog::error("Fatal: {}", ex.what());
        return EXIT_FAILURE;
    }

    return EXIT_SUCCESS;
}

// -----------------------------------------------------------
// Sub-command implementations
// -----------------------------------------------------------

static void cmd_serve(std::uint16_t port, const std::string& config)
{
    install_signal_handlers();

    if (!fs::exists(config)) {
        throw std::runtime_error(
            fmt::format("Config file not found: {}", config));
    }

    spdlog::info("Loading configuration from: {}", config);
    drogon::app().loadConfigFile(config);

    // CLI --port overrides the config value.
    drogon::app().addListener("0.0.0.0", port);

    // Inject CORS headers on every response when the
    // CorsFilter stored an origin in the request attrs.
    drogon::app().registerPreSendingAdvice(
        [](const drogon::HttpRequestPtr& req,
           const drogon::HttpResponsePtr& resp) {
            auto* origin = req->attributes()->find<std::string>("cors_origin");
            if (origin == nullptr || origin->empty()) {
                return;
            }
            resp->addHeader("Access-Control-Allow-Origin", *origin);
            resp->addHeader("Access-Control-Allow-Methods",
                            "GET, POST, PUT, PATCH, DELETE, OPTIONS");
            resp->addHeader("Access-Control-Allow-Headers",
                            "Content-Type, Authorization");
            resp->addHeader("Access-Control-Allow-Credentials", "true");
        });

    spdlog::info("Starting nextra-api on port {}", port);
    drogon::app().run();

    spdlog::info("Server stopped.");
}

static void cmd_migrate(bool up, bool down, bool status)
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

static void cmd_seed(const std::string& file)
{
    if (file.empty()) {
        spdlog::info("Loading all seed files from seed/");
        /// @todo Iterate seed/*.json and insert rows.
    } else {
        if (!fs::exists(file)) {
            throw std::runtime_error(
                fmt::format("Seed file not found: {}", file));
        }
        spdlog::info("Loading seed file: {}", file);
        /// @todo Parse JSON and insert rows.
    }
    fmt::print("Seed: not yet implemented\n");
}

static void cmd_create_admin(const std::string& email,
                             const std::string& password)
{
    spdlog::info("Creating admin account for: {}", email);

    /// @todo Hash password with bcrypt / argon2,
    ///       insert user row with role = 'admin'.

    fmt::print("create-admin: not yet implemented\n");
}
