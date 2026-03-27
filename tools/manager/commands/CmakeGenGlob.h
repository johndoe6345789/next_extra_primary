/**
 * @file CmakeGenGlob.h
 * @brief Glob-to-regex conversion and source file discovery
 *        for the embedded cmake-gen functionality.
 */

#pragma once

#include <algorithm>
#include <filesystem>
#include <iostream>
#include <regex>
#include <string>
#include <vector>

namespace fs = std::filesystem;

namespace manager
{

/**
 * @brief Convert an fnmatch-style glob to std::regex.
 * @param glob The glob pattern (supports * and ?).
 * @return std::regex Compiled case-insensitive regex.
 */
inline std::regex glob_to_regex(const std::string& glob)
{
    static const std::string meta = ".()[]{}+^$|\\";
    std::string pat;
    pat.reserve(glob.size() * 2);
    for (char ch : glob) {
        if (ch == '*') {
            pat += ".*";
        } else if (ch == '?') {
            pat += '.';
        } else if (meta.find(ch) != std::string::npos) {
            pat += '\\';
            pat += ch;
        } else {
            pat += ch;
        }
    }
    return std::regex(pat, std::regex::icase);
}

/**
 * @brief Test if a filename matches any glob pattern.
 * @param filename The filename to test.
 * @param patterns List of glob pattern strings.
 * @return true if at least one pattern matches.
 */
inline bool matches_any(const std::string& filename,
                        const std::vector<std::string>& patterns)
{
    for (const auto& p : patterns) {
        if (std::regex_match(filename, glob_to_regex(p))) {
            return true;
        }
    }
    return false;
}

/**
 * @brief Walk a directory tree and collect source files
 *        matching include globs, filtering out excludes.
 * @param base_dir   Project root.
 * @param src_dir    Relative path to source directory.
 * @param includes   Glob patterns to include.
 * @param excludes   Glob patterns to exclude.
 * @return Sorted vector of relative paths.
 */
inline std::vector<std::string>
discover_sources(const fs::path& base_dir, const std::string& src_dir,
                 const std::vector<std::string>& includes,
                 const std::vector<std::string>& excludes)
{
    std::vector<std::string> result;
    fs::path search = base_dir / src_dir;

    if (!fs::exists(search)) {
        std::cerr << "[cmake-gen] warn: " << search << " missing\n";
        return result;
    }

    for (const auto& e : fs::recursive_directory_iterator(search)) {
        if (!e.is_regular_file()) {
            continue;
        }
        auto name = e.path().filename().string();
        if (!matches_any(name, includes)) {
            continue;
        }
        if (!excludes.empty() && matches_any(name, excludes)) {
            continue;
        }
        result.push_back(fs::relative(e.path(), base_dir).generic_string());
    }

    std::sort(result.begin(), result.end());
    return result;
}

} // namespace manager
