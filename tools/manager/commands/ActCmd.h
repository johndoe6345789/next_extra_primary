/**
 * @file ActCmd.h
 * @brief Run GitHub Actions workflows locally via act.
 */

#pragma once

#include <CLI/CLI.hpp>

namespace manager
{

/// @brief Runs .local/ workflows with nektos/act.
class ActCmd
{
  public:
    static constexpr const char* kWorkflowDir = ".local/workflows";

    /// @brief Register all subcommands under "act".
    static void registerAll(CLI::App& parent);

    /// @brief Run a specific workflow file.
    static int runWorkflow(const std::string& file, const std::string& job,
                           bool verbose);

    /// @brief List available workflows.
    static int list();
};

} // namespace manager
