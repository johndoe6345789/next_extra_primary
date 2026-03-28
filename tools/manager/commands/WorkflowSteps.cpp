/// @file WorkflowSteps.cpp
/// @brief Additional step types for complex workflows.
#include "WorkflowEngine.h"
#include "CmakeGenCmd.h"
#include <filesystem>
#include <fmt/core.h>
#include <fstream>

namespace manager
{

/// @brief Write content to a file, creating parents.
/// @param s JSON step with "path" and "content" keys.
/// @param ctx Variable context for expansion.
/// @return 0 on success, 1 on failure.
int stepWrite(const nlohmann::json& s, WorkflowCtx& ctx)
{
    namespace fs = std::filesystem;
    auto path = ctx.expand(s["path"].get<std::string>());
    auto content = ctx.expand(
        s["content"].get<std::string>());
    auto parent = fs::path(path).parent_path();
    if (!parent.empty())
        fs::create_directories(parent);
    std::ofstream out(path);
    if (!out) {
        fmt::print("[workflow] Cannot write: {}\n", path);
        return 1;
    }
    out << content;
    return 0;
}

/// @brief Try steps, run recovery on fail, retry once.
/// @param s JSON step with "steps" and "on_fail" arrays.
/// @param ctx Variable context for expansion.
/// @return Result of the retry (or first run if it passed).
int stepRetry(const nlohmann::json& s, WorkflowCtx& ctx)
{
    int rc = executeWorkflow(s["steps"], ctx);
    if (rc == 0)
        return 0;
    if (s.contains("on_fail"))
        executeWorkflow(s["on_fail"], ctx);
    return executeWorkflow(s["steps"], ctx);
}

/// @brief Render inja templates via CmakeGenCmd.
/// @param s JSON step with "input", "templates", "output".
/// @param ctx Variable context for expansion.
/// @return 0 on success, non-zero on failure.
int stepTemplate(const nlohmann::json& s,
                 WorkflowCtx& ctx)
{
    auto input = ctx.expand(
        s["input"].get<std::string>());
    auto tmpl = ctx.expand(
        s["templates"].get<std::string>());
    auto output = ctx.expand(
        s["output"].get<std::string>());
    return executeCmakeGen(input, output, tmpl);
}

int executeCmakeGen(const std::string& input,
                    const std::string& output,
                    const std::string& templates)
{
    return CmakeGenCmd::execute(input, output, templates);
}

} // namespace manager
