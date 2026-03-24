/**
 * @file DockerCmd.cpp
 * @brief Implementation of the docker subcommand.
 */

#include "DockerCmd.h"

#include <fmt/core.h>

#include <cstdlib>
#include <string>
#include <unordered_map>

namespace manager {

/**
 * @brief Run a shell command, printing it first.
 *
 * @param cmd The command string to execute.
 * @return int The process exit code.
 */
static int run(const std::string& cmd) {
    fmt::print("[docker] $ {}\n", cmd);
    return std::system(cmd.c_str());
}

int DockerCmd::execute(const std::string& action) {
    // Map action names to docker compose commands.
    static const std::unordered_map<
        std::string, std::string
    > commands = {
        {"build", "docker compose build"},
        {"up",    "docker compose up -d"},
        {"down",  "docker compose down"},
        {"logs",  "docker compose logs -f --tail=100"},
    };

    auto it = commands.find(action);
    if (it == commands.end()) {
        fmt::print(
            "[docker] Unknown action: '{}'\n"
            "[docker] Valid actions: "
            "build, up, down, logs\n",
            action
        );
        return 1;
    }

    fmt::print(
        "[docker] Running '{}' ...\n", action
    );

    int rc = run(it->second);
    if (rc != 0) {
        fmt::print(
            "[docker] '{}' failed (exit {})\n",
            action, rc
        );
    }

    return rc;
}

} // namespace manager
