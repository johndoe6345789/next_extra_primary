/**
 * @file main.cpp
 * @brief Project Manager CLI — pure engine runtime.
 *
 * Every command is JSON-driven via .local/commands/.
 * Only act retains C++ registration for its YAML
 * introspection (runner extraction, workflow mapping).
 */

#include <CLI/CLI.hpp>

#include "commands/ActCmd.h"
#include "commands/WorkflowEngine.h"

int main(int argc, char** argv)
{
    CLI::App app{"manager: nextra-api project management tool"};
    app.require_subcommand(1);

    // ---- C++ command (YAML introspection, sorts first) ----
    manager::ActCmd::registerAll(app);

    // ---- JSON workflow commands (.local/commands/) ----
    manager::registerWorkflows(app);

    CLI11_PARSE(app, argc, argv);
    return EXIT_SUCCESS;
}
