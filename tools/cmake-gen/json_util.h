#pragma once
/**
 * @file json_util.h
 * @brief JSON file reading and summary printing for
 *        cmake-gen.
 */

#include <nlohmann/json.hpp>

#include <filesystem>
#include <fstream>
#include <iostream>
#include <stdexcept>

namespace fs = std::filesystem;
using json = nlohmann::json;

namespace cmakegen
{

/**
 * @brief Read and parse a JSON file.
 *
 * @param path Path to the JSON file.
 * @return json Parsed JSON object.
 * @throws std::runtime_error if file cannot be read.
 */
inline json readJson(const fs::path& path)
{
    std::ifstream ifs(path);
    if (!ifs.is_open()) {
        throw std::runtime_error(
            "Cannot open file: " + path.string());
    }
    return json::parse(ifs);
}

/**
 * @brief Print discovery summary for all targets.
 *
 * @param ctx Template context with "targets" array.
 */
inline void printSummary(const json& ctx)
{
    for (const auto& t : ctx["targets"]) {
        auto count = t["source_files"].size();
        std::cout << "[cmake-gen] Target '"
                  << t["name"].get<std::string>()
                  << "': " << count
                  << " source file(s)\n";
    }
}

} // namespace cmakegen
