/**
 * @file ActCmdReg.cpp
 * @brief CLI subcommand registration for act commands.
 */

#include "ActCmd.h"

#include <string>

namespace manager
{

void ActCmd::registerAll(CLI::App& parent)
{
    auto* cmd = parent.add_subcommand("act", "Run .local workflows with act");
    cmd->require_subcommand(1);

    cmd->add_subcommand("list", "List workflows")->callback([]() { list(); });

    cmd->add_subcommand("ci", "Run CI pipeline")->callback([]() {
        runWorkflow("ci.yml", "", false);
    });

    cmd->add_subcommand("build", "Build Docker images (amd64)")->callback([]() {
        runWorkflow("docker-build-amd64.yml", "", false);
    });

    auto* run = cmd->add_subcommand("run", "Run a specific workflow file");
    static std::string file;
    static std::string job;
    static bool verbose = false;
    run->add_option("file", file, "Workflow .yml file")->required();
    run->add_option("-j,--job", job, "Run only this job");
    run->add_flag("-v,--verbose", verbose, "Verbose act output");
    run->callback([]() { runWorkflow(file, job, verbose); });
}

} // namespace manager
