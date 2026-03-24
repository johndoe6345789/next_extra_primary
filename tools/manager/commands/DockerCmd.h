/**
 * @file DockerCmd.h
 * @brief Docker subcommand - manages docker compose
 *        build, up, down, and logs operations.
 */

#ifndef MANAGER_COMMANDS_DOCKER_CMD_H
#define MANAGER_COMMANDS_DOCKER_CMD_H

#include <string>

namespace manager {

/**
 * @class DockerCmd
 * @brief Constructs and executes docker compose commands.
 */
class DockerCmd {
public:
    /**
     * @brief Execute a docker compose action.
     *
     * @param action One of: build, up, down, logs.
     * @return int 0 on success, non-zero on failure.
     */
    static int execute(const std::string& action);
};

} // namespace manager

#endif // MANAGER_COMMANDS_DOCKER_CMD_H
