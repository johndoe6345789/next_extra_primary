/**
 * @file BuildCmd.h
 * @brief Build subcommand - runs conan install, cmake
 *        configure, and cmake build steps.
 */

#ifndef MANAGER_COMMANDS_BUILD_CMD_H
#define MANAGER_COMMANDS_BUILD_CMD_H

namespace manager
{

/**
 * @class BuildCmd
 * @brief Handles the full build pipeline: conan install,
 *        CMake configure, and CMake build.
 */
class BuildCmd
{
  public:
    /**
     * @brief Execute the build pipeline.
     *
     * Runs conan install to resolve dependencies, then
     * configures and builds with CMake.
     *
     * @param release If true, build in Release mode;
     *                otherwise Debug.
     * @return int 0 on success, non-zero on failure.
     */
    static int execute(bool release);
};

} // namespace manager

#endif // MANAGER_COMMANDS_BUILD_CMD_H
