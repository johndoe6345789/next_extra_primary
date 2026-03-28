/**
 * @file WorkflowReg.cpp
 * @brief Register JSON-defined commands as CLI subcommands.
 */

#include "ShellUtil.h"
#include "WorkflowEngine.h"

#include <fmt/core.h>
#include <nlohmann/json.hpp>

#include <algorithm>
#include <cstdlib>
#include <filesystem>
#include <fstream>
#include <string>
#include <vector>

using json = nlohmann::json;

namespace manager
{

static constexpr const char* kCommandsDir = ".local/commands";

/// @brief Register one JSON command entry.
static void registerCmd(CLI::App* parent, const json& def)
{
    auto name = def["name"].get<std::string>();
    auto desc = def["description"].get<std::string>();
    auto* sub = parent->add_subcommand(name, desc);

    auto opts = std::make_shared<std::map<std::string, std::string>>();
    auto flags = std::make_shared<std::map<std::string, bool>>();

    if (def.contains("options")) {
        for (const auto& opt : def["options"]) {
            auto oname = opt["name"].get<std::string>();
            auto help = opt.value("help", "");
            auto dflt = opt.value("default", "");
            (*opts)[oname] = dflt;
            if (opt.value("flag", false)) {
                (*flags)[oname] = false;
                sub->add_flag("--" + oname, (*flags)[oname], help);
            } else {
                sub->add_option("--" + oname, (*opts)[oname], help);
            }
        }
    }

    auto steps = def["steps"];
    sub->callback([opts, flags, steps]() {
        WorkflowCtx ctx;
        ctx.loadBuiltins();
        for (const auto& [k, v] : *opts)
            ctx.set("opt." + k, v);
        for (const auto& [k, v] : *flags)
            ctx.set("opt." + k, v ? "true" : "false");
        executeWorkflow(steps, ctx);
    });
}

/// @brief Load one command file and register it.
static void loadFile(CLI::App& app, const std::filesystem::path& path)
{
    std::ifstream in(path);
    if (!in.is_open())
        return;
    try {
        registerCmd(&app, json::parse(in));
    } catch (const std::exception& e) {
        fmt::print("[workflow] Bad {}: {}\n", path.filename().string(),
                   e.what());
    }
}

void registerWorkflows(CLI::App& app)
{
    const char* envDir = std::getenv("MANAGER_COMMANDS_DIR");
    auto dir = (envDir && std::filesystem::exists(envDir))
        ? std::filesystem::path(envDir)
        : repoRoot() / kCommandsDir;
    if (!std::filesystem::exists(dir))
        return;
    std::vector<std::filesystem::path> files;
    for (const auto& entry : std::filesystem::directory_iterator(dir)) {
        if (entry.path().extension() == ".json")
            files.push_back(entry.path());
    }
    std::sort(files.begin(), files.end());
    for (const auto& f : files)
        loadFile(app, f);
}

} // namespace manager
