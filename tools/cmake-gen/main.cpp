/**
 * @file main.cpp
 * @brief CMake Generator entry point.
 *
 * Parses CLI arguments, reads project.json, discovers
 * source files, renders templates, and writes output.
 */

#include "context_builder.h"
#include "json_util.h"
#include "template_renderer.h"

#include <CLI/CLI.hpp>

#include <cstdlib>
#include <filesystem>
#include <iostream>

namespace fs = std::filesystem;

/**
 * @brief Program entry point.
 *
 * @param argc Argument count.
 * @param argv Argument vector.
 * @return int Exit code (0 on success).
 */
int main(int argc, char** argv)
{
    CLI::App app{"cmake-gen: Generate CMakeLists.txt "
                 "from project.json and inja templates"};

    std::string inputPath = "project.json";
    std::string outputDir = ".";
    std::string templatesDir = "templates";

    app.add_option("-i,--input", inputPath,
                   "Path to project.json manifest")
        ->check(CLI::ExistingFile);
    app.add_option("-o,--output", outputDir,
                   "Output directory for CMakeLists.txt");
    app.add_option("-t,--templates", templatesDir,
                   "Directory with .cmake.j2 templates");

    CLI11_PARSE(app, argc, argv);

    try {
        fs::path inputAbs = fs::absolute(inputPath);
        fs::path baseDir = inputAbs.parent_path();
        fs::path outAbs = fs::absolute(outputDir);
        fs::path tmplAbs = fs::absolute(templatesDir);

        std::cout << "[cmake-gen] Reading: "
                  << inputAbs << "\n";

        auto project = cmakegen::readJson(inputAbs);
        auto ctx = cmakegen::buildContext(project, baseDir);

        cmakegen::printSummary(ctx);

        auto n = cmakegen::renderTemplates(
            tmplAbs, outAbs, ctx);

        std::cout << "\n[cmake-gen] Done: "
                  << n << " file(s) generated.\n";
    } catch (const std::exception& ex) {
        std::cerr << "[cmake-gen] Error: "
                  << ex.what() << "\n";
        return EXIT_FAILURE;
    }

    return EXIT_SUCCESS;
}
