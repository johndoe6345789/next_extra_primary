/**
 * @file MigrationFileUtils.cpp
 * @brief File-system utilities for SQL migration files.
 */

#include "services/MigrationFileUtils.h"

#include <fmt/format.h>
#include <spdlog/spdlog.h>

#include <algorithm>
#include <filesystem>
#include <fstream>
#include <sstream>
#include <stdexcept>

namespace fs = std::filesystem;

namespace services
{

auto MigrationFileUtils::discoverFiles(const std::string& dir)
    -> std::vector<std::string>
{
    std::vector<std::string> files;
    if (!fs::exists(dir) || !fs::is_directory(dir)) {
        spdlog::warn("Migrations directory not found: {}", dir);
        return files;
    }

    for (const auto& entry : fs::directory_iterator(dir)) {
        if (entry.is_regular_file()
            && entry.path().extension() == ".sql") {
            files.push_back(entry.path().filename().string());
        }
    }
    std::ranges::sort(files);
    return files;
}

auto MigrationFileUtils::readFile(const std::string& path) -> std::string
{
    std::ifstream ifs(path);
    if (!ifs.is_open()) {
        throw std::runtime_error(
            fmt::format("Cannot open file: {}", path));
    }
    std::ostringstream ss;
    ss << ifs.rdbuf();
    return ss.str();
}

auto MigrationFileUtils::extractUp(const std::string& sql) -> std::string
{
    auto pos = sql.find("-- DOWN");
    if (pos == std::string::npos) {
        return sql;
    }
    return sql.substr(0, pos);
}

auto MigrationFileUtils::extractDown(const std::string& sql) -> std::string
{
    auto pos = sql.find("-- DOWN");
    if (pos == std::string::npos) {
        return {};
    }
    auto lineEnd = sql.find('\n', pos);
    if (lineEnd == std::string::npos) {
        return {};
    }
    return sql.substr(lineEnd + 1);
}

} // namespace services
