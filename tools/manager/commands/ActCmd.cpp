/**
 * @file ActCmd.cpp
 * @brief Run .local/ GitHub Actions workflows via act.
 */

#include "ActCmd.h"
#include "ShellUtil.h"

#include <fmt/core.h>

#include <filesystem>
#include <string>

namespace fs = std::filesystem;

namespace manager
{

static bool checkAct()
{
    if (std::system("act --version >/dev/null 2>&1") != 0) {
        fmt::print("[act] 'act' is not installed.\n");
        fmt::print("[act] Install: brew install act\n");
        fmt::print("[act]      or: "
                   "https://nektosact.com\n");
        return false;
    }
    return true;
}

static std::string buildActCmd(const std::string& file,
                               const std::string& job,
                               bool verbose)
{
    auto cmd = fmt::format(
        "act -W {}/{}", ActCmd::kWorkflowDir, file);
    if (!job.empty())
        cmd += fmt::format(" -j {}", job);
    if (verbose)
        cmd += " -v";
    return cmd;
}

int ActCmd::runWorkflow(const std::string& file,
                        const std::string& job,
                        bool verbose)
{
    if (!checkAct()) return 1;

    auto path = fmt::format("{}/{}", kWorkflowDir, file);
    if (!fs::exists(path)) {
        fmt::print("[act] Workflow not found: {}\n", path);
        return 1;
    }

    return shell("act", buildActCmd(file, job, verbose));
}

int ActCmd::list()
{
    if (!fs::exists(kWorkflowDir)) {
        fmt::print("[act] No workflow dir: {}\n",
                   kWorkflowDir);
        return 1;
    }

    fmt::print("[act] Available workflows in {}:\n",
               kWorkflowDir);
    for (const auto& entry :
         fs::directory_iterator(kWorkflowDir)) {
        if (entry.path().extension() == ".yml")
            fmt::print("  - {}\n",
                       entry.path().filename().string());
    }
    return 0;
}

void ActCmd::registerAll(CLI::App& parent)
{
    auto* cmd = parent.add_subcommand(
        "act", "Run .local workflows with act");
    cmd->require_subcommand(1);

    // act list
    cmd->add_subcommand("list", "List workflows")
        ->callback([]() { list(); });

    // act ci
    cmd->add_subcommand("ci", "Run CI pipeline")
        ->callback([]() { runWorkflow("ci.yml", "", false); });

    // act build
    cmd->add_subcommand("build",
                        "Build Docker images (amd64)")
        ->callback([]() {
            runWorkflow("docker-build-amd64.yml", "", false);
        });

    // act run <file> [-j job] [-v]
    auto* run = cmd->add_subcommand(
        "run", "Run a specific workflow file");
    static std::string file;
    static std::string job;
    static bool verbose = false;
    run->add_option("file", file, "Workflow .yml file")
        ->required();
    run->add_option("-j,--job", job,
                    "Run only this job");
    run->add_flag("-v,--verbose", verbose,
                  "Verbose act output");
    run->callback([]() {
        runWorkflow(file, job, verbose);
    });
}

} // namespace manager
