/**
 * @file main.cpp
 * @brief Project Manager CLI - unified build, test, run,
 *        docker, lint, format, generate, migrate, and seed
 *        commands for the nextra-api project.
 *
 * Uses CLI11 for subcommand parsing, nlohmann/json for
 * configuration, and fmt for formatted output.
 */

#include <CLI/CLI.hpp>
#include <fmt/core.h>

#include <cstdlib>
#include <string>

#include "commands/BuildCmd.h"
#include "commands/DockerCmd.h"
#include "commands/GenerateCmd.h"
#include "commands/LintCmd.h"
#include "commands/SetupExoticArchCmd.h"
#include "commands/TestCmd.h"

/**
 * @brief Run a shell command and return its exit code.
 * @param cmd The command string.
 * @return int The process exit code.
 */
static int run_cmd(const std::string& cmd)
{
    fmt::print("[manager] $ {}\n", cmd);
    return std::system(cmd.c_str());
}

/**
 * @brief Register the migrate subcommand.
 *
 * @param app  The parent CLI::App.
 */
static void register_migrate(CLI::App& app)
{
    auto* migrate = app.add_subcommand("migrate", "Run database migrations");

    std::string direction = "up";
    migrate->add_option("direction", direction,
                        "Migration direction: up, down, or status");

    migrate->callback([&direction]() {
        std::string cmd;
        if (direction == "up") {
            cmd = "drogon_ctl migrate up";
        } else if (direction == "down") {
            cmd = "drogon_ctl migrate down";
        } else if (direction == "status") {
            cmd = "drogon_ctl migrate status";
        } else {
            fmt::print("[manager] Unknown direction: {}\n", direction);
            return;
        }
        int rc = std::system(cmd.c_str());
        if (rc != 0) {
            fmt::print("[manager] Migration failed ({})\n", rc);
        }
    });
}

/**
 * @brief Register the seed subcommand.
 *
 * @param app  The parent CLI::App.
 */
static void register_seed(CLI::App& app)
{
    auto* seed = app.add_subcommand("seed", "Seed the database");

    std::string file_path;
    seed->add_option("-f,--file", file_path, "Path to seed data file");

    seed->callback([&file_path]() {
        std::string cmd = "drogon_ctl seed";
        if (!file_path.empty()) {
            cmd += " --file " + file_path;
        }
        int rc = std::system(cmd.c_str());
        if (rc != 0) {
            fmt::print("[manager] Seed failed ({})\n", rc);
        }
    });
}

/**
 * @brief Register the run subcommand.
 *
 * @param app  The parent CLI::App.
 */
static void register_run(CLI::App& app)
{
    auto* sub = app.add_subcommand("run", "Build and run the application");

    int port = 8080;
    std::string config;

    sub->add_option("-p,--port", port, "Port number");
    sub->add_option("-c,--config", config, "Config file path");

    sub->callback([&port, &config]() {
        // Build first in release mode.
        if (manager::BuildCmd::execute(true) != 0) {
            fmt::print("[manager] Build failed\n");
            return;
        }

        std::string cmd = fmt::format("./build/Release/nextra-api");
        if (port != 8080) {
            cmd += fmt::format(" --port {}", port);
        }
        if (!config.empty()) {
            cmd += " --config " + config;
        }

        int rc = run_cmd(cmd);
        if (rc != 0) {
            fmt::print("[manager] Run failed ({})\n", rc);
        }
    });
}

/**
 * @brief Program entry point.
 *
 * Sets up CLI11 with all subcommands and dispatches.
 *
 * @param argc Argument count.
 * @param argv Argument vector.
 * @return int Exit code.
 */
int main(int argc, char** argv)
{
    CLI::App app{"manager: nextra-api project management tool"};
    app.require_subcommand(1);

    // ---- build ----
    auto* build = app.add_subcommand("build", "Build the project");
    bool release = false;
    bool debug = false;
    build->add_flag("--release", release, "Release build");
    build->add_flag("--debug", debug, "Debug build");
    build->callback([&release]() {
        int rc = manager::BuildCmd::execute(release);
        if (rc != 0) {
            fmt::print("[manager] Build failed ({})\n", rc);
        }
    });

    // ---- test ----
    auto* test = app.add_subcommand("test", "Build and run tests");
    std::string filter;
    test->add_option("-f,--filter", filter, "Test name filter");
    test->callback([&filter]() {
        int rc = manager::TestCmd::execute(filter);
        if (rc != 0) {
            fmt::print("[manager] Tests failed ({})\n", rc);
        }
    });

    // ---- run ----
    register_run(app);

    // ---- docker ----
    auto* docker = app.add_subcommand("docker", "Docker compose operations");
    std::string docker_action;
    docker->add_option("action", docker_action, "Action: build, up, down, logs")
        ->required();
    docker->callback([&docker_action]() {
        int rc = manager::DockerCmd::execute(docker_action);
        if (rc != 0) {
            fmt::print("[manager] Docker failed ({})\n", rc);
        }
    });

    // ---- lint ----
    auto* lint =
        app.add_subcommand("lint", "Run clang-format and clang-tidy checks");
    lint->callback([]() {
        int rc = manager::LintCmd::lint();
        if (rc != 0) {
            fmt::print("[manager] Lint found issues ({})\n", rc);
        }
    });

    // ---- fmt ----
    auto* fmt_cmd =
        app.add_subcommand("fmt", "Format source files with clang-format");
    fmt_cmd->callback([]() {
        int rc = manager::LintCmd::format();
        if (rc != 0) {
            fmt::print("[manager] Format failed ({})\n", rc);
        }
    });

    // ---- generate ----
    auto* gen = app.add_subcommand("generate", "Generate cmake or models");
    std::string gen_target;
    gen->add_option("target", gen_target, "What to generate: cmake, models")
        ->required();
    gen->callback([&gen_target]() {
        int rc = manager::GenerateCmd::execute(gen_target);
        if (rc != 0) {
            fmt::print("[manager] Generate failed ({})\n", rc);
        }
    });

    // ---- setup-exotic-arch ----
    auto* exotic = app.add_subcommand(
        "setup-exotic-arch",
        "Patch node_modules for riscv64/ppc64le builds");
    std::string swc_dir = "/tmp/swc";
    std::string nm_dir = "node_modules";
    exotic->add_option("--swc-dir", swc_dir,
                       "Directory with cached .node files");
    exotic->add_option("--node-modules", nm_dir,
                       "Path to node_modules");
    exotic->callback([&swc_dir, &nm_dir]() {
        int rc = manager::SetupExoticArchCmd::execute(
            swc_dir, nm_dir);
        if (rc != 0) {
            fmt::print("[manager] setup-exotic-arch "
                       "failed ({})\n",
                       rc);
        }
    });

    // ---- migrate ----
    register_migrate(app);

    // ---- seed ----
    register_seed(app);

    CLI11_PARSE(app, argc, argv);
    return EXIT_SUCCESS;
}
