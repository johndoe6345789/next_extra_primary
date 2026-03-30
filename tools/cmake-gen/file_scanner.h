#pragma once
/**
 * @file file_scanner.h
 * @brief Source file discovery using recursive directory
 *        iteration and glob pattern matching.
 */

#include "glob_util.h"

#include <algorithm>
#include <filesystem>
#include <iostream>
#include <string>
#include <vector>

namespace fs = std::filesystem;

namespace cmakegen
{

/**
 * @brief Discover source files in a directory matching
 *        include globs and excluding exclude globs.
 *
 * @param baseDir         Project root directory.
 * @param sourcesDir      Relative path to sources.
 * @param includePatterns Glob patterns to include.
 * @param excludePatterns Glob patterns to exclude.
 * @return std::vector<std::string> Relative paths found.
 */
inline std::vector<std::string> discoverSources(
    const fs::path& baseDir,
    const std::string& sourcesDir,
    const std::vector<std::string>& includePatterns,
    const std::vector<std::string>& excludePatterns)
{
    std::vector<std::string> result;
    fs::path searchPath = baseDir / sourcesDir;

    if (!fs::exists(searchPath)) {
        std::cerr << "[warn] Sources dir does not exist: "
                  << searchPath << "\n";
        return result;
    }

    for (const auto& entry :
         fs::recursive_directory_iterator(searchPath)) {
        if (!entry.is_regular_file()) {
            continue;
        }
        auto fname = entry.path().filename().string();

        if (!matchesAny(fname, includePatterns)) {
            continue;
        }
        if (!excludePatterns.empty() &&
            matchesAny(fname, excludePatterns)) {
            continue;
        }

        auto rel = fs::relative(entry.path(), baseDir);
        result.push_back(rel.generic_string());
    }

    std::sort(result.begin(), result.end());
    return result;
}

} // namespace cmakegen
