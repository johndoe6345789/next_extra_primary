/**
 * @file GenerateCmd.cpp
 * @brief Implementation of the generate subcommand.
 */

#include "GenerateCmd.h"

#include <fmt/core.h>

#include <cstdlib>
#include <filesystem>
#include <string>

namespace fs = std::filesystem;

namespace manager
{

/**
 * @brief Run a shell command, printing it first.
 *
 * @param cmd The command string to execute.
 * @return int The process exit code.
 */
static int run(const std::string& cmd)
{
    fmt::print("[generate] $ {}\n", cmd);
    return std::system(cmd.c_str());
}

/**
 * @brief Generate CMakeLists.txt using cmake-gen.
 *
 * Locates the cmake-gen binary and project.json, then
 * invokes cmake-gen with appropriate arguments.
 *
 * @return int 0 on success, non-zero on failure.
 */
static int generate_cmake()
{
    fmt::print("[generate] Generating CMakeLists.txt...\n");

    // Locate cmake-gen binary.
    std::string cmake_gen_bin = "cmake-gen";
    if (fs::exists("tools/cmake-gen/build/cmake-gen")) {
        cmake_gen_bin = "tools/cmake-gen/build/cmake-gen";
    }

    // Locate project.json.
    std::string project_json = "project.json";
    if (fs::exists("tools/cmake-gen/project.json")) {
        project_json = "tools/cmake-gen/project.json";
    }

    std::string cmd = fmt::format("{} --input {} --output . "
                                  "--templates tools/cmake-gen/templates",
                                  cmake_gen_bin, project_json);

    int rc = run(cmd);
    if (rc == 0) {
        fmt::print("[generate] CMakeLists.txt generated.\n");
    }
    return rc;
}

/**
 * @brief Generate model files using drogon_ctl.
 *
 * Invokes drogon_ctl create model to generate ORM
 * model classes from the database schema.
 *
 * @return int 0 on success, non-zero on failure.
 */
static int generate_models()
{
    fmt::print("[generate] Generating Drogon models...\n");

    std::string models_dir = "src/models";
    fs::create_directories(models_dir);

    std::string cmd = fmt::format("drogon_ctl create model {}", models_dir);

    int rc = run(cmd);
    if (rc == 0) {
        fmt::print("[generate] Models generated in {}\n", models_dir);
    }
    return rc;
}

int GenerateCmd::execute(const std::string& target)
{
    if (target == "cmake") {
        return generate_cmake();
    }
    if (target == "models") {
        return generate_models();
    }

    fmt::print("[generate] Unknown target: '{}'\n"
               "[generate] Valid targets: cmake, models\n",
               target);
    return 1;
}

} // namespace manager
