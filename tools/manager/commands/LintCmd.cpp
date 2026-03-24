/**
 * @file LintCmd.cpp
 * @brief Implementation of lint and format subcommands.
 */

#include "LintCmd.h"

#include <fmt/core.h>

#include <algorithm>
#include <cstdlib>
#include <filesystem>
#include <string>
#include <vector>

namespace fs = std::filesystem;

namespace manager
{

/// Directories to scan for source files.
static const std::vector<std::string> kScanDirs = {"src", "tests", "include"};

/// File extensions to include.
static const std::vector<std::string> kExtensions = {".cpp", ".h", ".hpp",
                                                     ".cc", ".cxx"};

/**
 * @brief Check if a file extension is a C++ source.
 *
 * @param ext The file extension (with dot).
 * @return true if it matches a known C++ extension.
 */
static bool is_cpp_file(const std::string& ext)
{
    return std::find(kExtensions.begin(), kExtensions.end(), ext) !=
           kExtensions.end();
}

/**
 * @brief Discover all C++ source files in the project.
 *
 * Scans the configured directories recursively.
 *
 * @return std::vector<std::string> List of file paths.
 */
static std::vector<std::string> find_sources()
{
    std::vector<std::string> files;

    for (const auto& dir : kScanDirs) {
        if (!fs::exists(dir)) {
            continue;
        }
        for (const auto& entry : fs::recursive_directory_iterator(dir)) {
            if (!entry.is_regular_file()) {
                continue;
            }
            auto ext = entry.path().extension().string();
            if (is_cpp_file(ext)) {
                files.push_back(entry.path().string());
            }
        }
    }

    std::sort(files.begin(), files.end());
    return files;
}

/**
 * @brief Run a command and return its exit code.
 *
 * @param cmd Shell command to execute.
 * @return int Exit code.
 */
static int run(const std::string& cmd)
{
    fmt::print("[lint] $ {}\n", cmd);
    return std::system(cmd.c_str());
}

int LintCmd::lint()
{
    auto files = find_sources();
    if (files.empty()) {
        fmt::print("[lint] No source files found.\n");
        return 0;
    }

    fmt::print("[lint] Checking {} file(s)...\n", files.size());

    int result = 0;

    // Run clang-format in dry-run mode.
    for (const auto& file : files) {
        std::string cmd =
            fmt::format("clang-format --dry-run --Werror {}", file);
        int rc = run(cmd);
        if (rc != 0) {
            result = rc;
        }
    }

    // Run clang-tidy if compile_commands.json exists.
    if (fs::exists("build/Debug/compile_commands.json")) {
        for (const auto& file : files) {
            std::string cmd = fmt::format("clang-tidy "
                                          "-p build/Debug {}",
                                          file);
            int rc = run(cmd);
            if (rc != 0) {
                result = rc;
            }
        }
    } else {
        fmt::print("[lint] compile_commands.json not found; "
                   "skipping clang-tidy.\n"
                   "[lint] Run 'manager build --debug' "
                   "first.\n");
    }

    if (result == 0) {
        fmt::print("[lint] All checks passed.\n");
    } else {
        fmt::print("[lint] Issues found.\n");
    }

    return result;
}

int LintCmd::format()
{
    auto files = find_sources();
    if (files.empty()) {
        fmt::print("[fmt] No source files found.\n");
        return 0;
    }

    fmt::print("[fmt] Formatting {} file(s)...\n", files.size());

    int result = 0;

    for (const auto& file : files) {
        std::string cmd = fmt::format("clang-format -i {}", file);
        int rc = run(cmd);
        if (rc != 0) {
            result = rc;
            fmt::print("[fmt] Failed on: {}\n", file);
        }
    }

    if (result == 0) {
        fmt::print("[fmt] Formatting complete.\n");
    }

    return result;
}

} // namespace manager
