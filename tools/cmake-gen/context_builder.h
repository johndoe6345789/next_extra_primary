#pragma once
/**
 * @file context_builder.h
 * @brief Build inja template context from project.json,
 *        enriching targets with discovered source files.
 */

#include "file_scanner.h"

#include <nlohmann/json.hpp>

#include <filesystem>
#include <string>
#include <vector>

namespace fs = std::filesystem;
using json = nlohmann::json;

namespace cmakegen
{

/**
 * @brief Build the inja template context from a project
 *        manifest, enriching each target with discovered
 *        source file lists.
 *
 * @param project  The parsed project.json data.
 * @param baseDir  The project root directory.
 * @return json Template context for inja rendering.
 */
inline json buildContext(
    const json& project,
    const fs::path& baseDir)
{
    json ctx = project;
    bool hasTests = false;

    for (auto& target : ctx["targets"]) {
        std::vector<std::string> incPatterns;
        for (const auto& p : target["glob_patterns"]) {
            incPatterns.push_back(p.get<std::string>());
        }

        std::vector<std::string> excPatterns;
        for (const auto& p : target["exclude_patterns"]) {
            excPatterns.push_back(p.get<std::string>());
        }

        auto sources = discoverSources(
            baseDir,
            target["sources_dir"].get<std::string>(),
            incPatterns, excPatterns);

        target["source_files"] = json::array();
        for (const auto& s : sources) {
            target["source_files"].push_back(s);
        }

        if (target["name"].get<std::string>().find(
                "test") != std::string::npos) {
            hasTests = true;
        }
    }

    ctx["has_tests"] = hasTests;
    return ctx;
}

} // namespace cmakegen
