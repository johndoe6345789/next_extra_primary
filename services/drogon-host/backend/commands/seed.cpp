/**
 * @file seed.cpp
 * @brief Implementation of the seed sub-command.
 * @copyright 2024 Nextra Contributors
 */

#include "seed.h"

#include <fmt/core.h>
#include <spdlog/spdlog.h>

#include <filesystem>
#include <stdexcept>
#include <string>

namespace fs = std::filesystem;

namespace commands
{

void cmdSeed(const std::string& file)
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

} // namespace commands
