/**
 * @file SeedTransCmd.h
 * @brief CLI command to generate SQL INSERT statements
 *        from frontend i18n JSON files.
 */

#pragma once

#include <CLI/CLI.hpp>

#include <filesystem>
#include <string>

namespace manager
{

/**
 * @class SeedTransCmd
 * @brief Reads locale JSON files and outputs SQL
 *        INSERT statements for the translations table.
 */
class SeedTransCmd
{
  public:
    /**
     * @brief Register the seed-trans subcommand.
     * @param parent The root CLI::App.
     */
    static void registerAll(CLI::App& parent);

    /**
     * @brief Generate INSERT SQL from JSON files.
     * @param msgDir Path to messages directory.
     * @param outFile Output file (empty = stdout).
     * @return int 0 on success.
     */
    static int generate(
        const std::filesystem::path& msgDir,
        const std::string& outFile);
};

} // namespace manager
