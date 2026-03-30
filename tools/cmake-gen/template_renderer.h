#pragma once
/**
 * @file template_renderer.h
 * @brief Render inja .cmake.j2 templates and write output.
 */

#include <inja/inja.hpp>
#include <nlohmann/json.hpp>

#include <cstddef>
#include <filesystem>
#include <fstream>
#include <iostream>
#include <iterator>
#include <stdexcept>
#include <string>

namespace fs = std::filesystem;
using json = nlohmann::json;

namespace cmakegen
{

/**
 * @brief Write content to a file, creating parent
 *        directories as needed.
 *
 * @param path    Output file path.
 * @param content The string content to write.
 */
inline void writeFile(
    const fs::path& path,
    const std::string& content)
{
    fs::create_directories(path.parent_path());
    std::ofstream ofs(path);
    if (!ofs.is_open()) {
        throw std::runtime_error(
            "Cannot write to: " + path.string());
    }
    ofs << content;
}

/**
 * @brief Render all .cmake.j2 templates found in a
 *        directory and write the output files.
 *
 * @param tmplDir  Directory containing .cmake.j2 files.
 * @param outDir   Output directory for rendered files.
 * @param ctx      Template context data.
 * @return std::size_t Number of files generated.
 */
inline std::size_t renderTemplates(
    const fs::path& tmplDir,
    const fs::path& outDir,
    const json& ctx)
{
    inja::Environment env;
    std::size_t filesGenerated = 0;

    for (const auto& entry :
         fs::directory_iterator(tmplDir)) {
        if (!entry.is_regular_file()) {
            continue;
        }
        auto fname = entry.path().filename().string();
        if (fname.size() < 10 ||
            fname.substr(fname.size() - 9) != ".cmake.j2")
            continue;

        std::ifstream tfs(entry.path());
        std::string tmplContent(
            (std::istreambuf_iterator<char>(tfs)),
            std::istreambuf_iterator<char>());

        std::string rendered = env.render(tmplContent, ctx);

        std::string outName = "CMakeLists.txt";
        if (fname != "root.cmake.j2") {
            outName = fname.substr(0, fname.size() - 3);
        }

        fs::path outPath = outDir / outName;
        writeFile(outPath, rendered);
        ++filesGenerated;

        std::cout << "[cmake-gen] Generated: "
                  << outPath << "\n";
    }

    return filesGenerated;
}

} // namespace cmakegen
