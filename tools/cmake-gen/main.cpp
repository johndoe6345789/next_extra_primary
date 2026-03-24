/**
 * @file main.cpp
 * @brief CMake Generator - Reads project.json and generates
 *        CMakeLists.txt via inja templates.
 *
 * Uses CLI11 for argument parsing, nlohmann/json for project
 * manifest parsing, std::filesystem for source file discovery,
 * and inja for template rendering.
 */

#include <CLI/CLI.hpp>
#include <inja/inja.hpp>
#include <nlohmann/json.hpp>

#include <algorithm>
#include <cstdlib>
#include <filesystem>
#include <fstream>
#include <iostream>
#include <regex>
#include <sstream>
#include <string>
#include <vector>

namespace fs = std::filesystem;
using json = nlohmann::json;

/**
 * @brief Convert a glob pattern (fnmatch-style) to a
 *        std::regex pattern.
 *
 * Supports '*' (any chars) and '?' (single char).
 *
 * @param glob The glob pattern string.
 * @return std::regex The compiled regex.
 */
static std::regex glob_to_regex(const std::string& glob)
{
    std::string pattern;
    pattern.reserve(glob.size() * 2);
    for (char ch : glob) {
        switch (ch) {
        case '*':
            pattern += ".*";
            break;
        case '?':
            pattern += '.';
            break;
        case '.':
            pattern += "\\.";
            break;
        case '(':
            pattern += "\\(";
            break;
        case ')':
            pattern += "\\)";
            break;
        case '[':
            pattern += "\\[";
            break;
        case ']':
            pattern += "\\]";
            break;
        case '+':
            pattern += "\\+";
            break;
        case '^':
            pattern += "\\^";
            break;
        case '$':
            pattern += "\\$";
            break;
        case '|':
            pattern += "\\|";
            break;
        case '{':
            pattern += "\\{";
            break;
        case '}':
            pattern += "\\}";
            break;
        case '\\':
            pattern += "\\\\";
            break;
        default:
            pattern += ch;
            break;
        }
    }
    return std::regex(pattern, std::regex::icase);
}

/**
 * @brief Check if a filename matches any pattern in a list.
 *
 * @param filename  The filename to test.
 * @param patterns  List of glob pattern strings.
 * @return true if the filename matches at least one pattern.
 */
static bool matches_any(const std::string& filename,
                        const std::vector<std::string>& patterns)
{
    for (const auto& pat : patterns) {
        if (std::regex_match(filename, glob_to_regex(pat))) {
            return true;
        }
    }
    return false;
}

/**
 * @brief Discover source files in a directory matching
 *        include globs and excluding exclude globs.
 *
 * Uses recursive_directory_iterator to walk the tree.
 *
 * @param base_dir         Project root directory.
 * @param sources_dir      Relative path to sources.
 * @param include_patterns Glob patterns to include.
 * @param exclude_patterns Glob patterns to exclude.
 * @return std::vector<std::string> Relative paths found.
 */
static std::vector<std::string>
discover_sources(const fs::path& base_dir, const std::string& sources_dir,
                 const std::vector<std::string>& include_patterns,
                 const std::vector<std::string>& exclude_patterns)
{
    std::vector<std::string> result;
    fs::path search_path = base_dir / sources_dir;

    if (!fs::exists(search_path)) {
        std::cerr << "[warn] Sources dir does not exist: " << search_path
                  << "\n";
        return result;
    }

    for (const auto& entry : fs::recursive_directory_iterator(search_path)) {
        if (!entry.is_regular_file()) {
            continue;
        }
        auto fname = entry.path().filename().string();

        if (!matches_any(fname, include_patterns)) {
            continue;
        }
        if (!exclude_patterns.empty() && matches_any(fname, exclude_patterns)) {
            continue;
        }

        auto rel = fs::relative(entry.path(), base_dir);
        result.push_back(rel.generic_string());
    }

    std::sort(result.begin(), result.end());
    return result;
}

/**
 * @brief Read and parse a JSON file.
 *
 * @param path Path to the JSON file.
 * @return json Parsed JSON object.
 * @throws std::runtime_error if file cannot be read.
 */
static json read_json(const fs::path& path)
{
    std::ifstream ifs(path);
    if (!ifs.is_open()) {
        throw std::runtime_error("Cannot open file: " + path.string());
    }
    return json::parse(ifs);
}

/**
 * @brief Build the inja template context from the project
 *        manifest, enriching each target with discovered
 *        source file lists.
 *
 * @param project  The parsed project.json data.
 * @param base_dir The project root directory.
 * @return json Template context for inja rendering.
 */
static json build_context(const json& project, const fs::path& base_dir)
{
    json ctx = project;
    bool has_tests = false;

    for (auto& target : ctx["targets"]) {
        std::vector<std::string> inc_patterns;
        for (const auto& p : target["glob_patterns"]) {
            inc_patterns.push_back(p.get<std::string>());
        }

        std::vector<std::string> exc_patterns;
        for (const auto& p : target["exclude_patterns"]) {
            exc_patterns.push_back(p.get<std::string>());
        }

        auto sources =
            discover_sources(base_dir, target["sources_dir"].get<std::string>(),
                             inc_patterns, exc_patterns);

        target["source_files"] = json::array();
        for (const auto& s : sources) {
            target["source_files"].push_back(s);
        }

        if (target["name"].get<std::string>().find("test") !=
            std::string::npos) {
            has_tests = true;
        }
    }

    ctx["has_tests"] = has_tests;
    return ctx;
}

/**
 * @brief Write content to a file, creating parent
 *        directories as needed.
 *
 * @param path    Output file path.
 * @param content The string content to write.
 */
static void write_file(const fs::path& path, const std::string& content)
{
    fs::create_directories(path.parent_path());
    std::ofstream ofs(path);
    if (!ofs.is_open()) {
        throw std::runtime_error("Cannot write to: " + path.string());
    }
    ofs << content;
}

/**
 * @brief Program entry point.
 *
 * Parses CLI arguments, reads project.json, discovers
 * source files, renders templates, and writes output.
 *
 * @param argc Argument count.
 * @param argv Argument vector.
 * @return int Exit code (0 on success).
 */
int main(int argc, char** argv)
{
    CLI::App app{"cmake-gen: Generate CMakeLists.txt from "
                 "project.json and inja templates"};

    std::string input_path = "project.json";
    std::string output_dir = ".";
    std::string templates_dir = "templates";

    app.add_option("-i,--input", input_path, "Path to project.json manifest")
        ->check(CLI::ExistingFile);

    app.add_option("-o,--output", output_dir,
                   "Output directory for generated CMakeLists.txt");

    app.add_option("-t,--templates", templates_dir,
                   "Directory containing .cmake.j2 templates");

    CLI11_PARSE(app, argc, argv);

    try {
        fs::path input_abs = fs::absolute(input_path);
        fs::path base_dir = input_abs.parent_path();
        fs::path out_abs = fs::absolute(output_dir);
        fs::path tmpl_abs = fs::absolute(templates_dir);

        std::cout << "[cmake-gen] Reading: " << input_abs << "\n";

        json project = read_json(input_abs);
        json ctx = build_context(project, base_dir);

        // Print discovery summary.
        std::size_t total_sources = 0;
        for (const auto& t : ctx["targets"]) {
            auto count = t["source_files"].size();
            total_sources += count;
            std::cout << "[cmake-gen] Target '" << t["name"].get<std::string>()
                      << "': " << count << " source file(s)\n";
        }

        // Render each template found in the templates dir.
        inja::Environment env;
        std::size_t files_generated = 0;

        for (const auto& entry : fs::directory_iterator(tmpl_abs)) {
            if (!entry.is_regular_file()) {
                continue;
            }
            auto fname = entry.path().filename().string();
            if (fname.size() < 10 ||
                fname.substr(fname.size() - 9) != ".cmake.j2") {
                continue;
            }

            // Read template content.
            std::ifstream tfs(entry.path());
            std::string tmpl_content((std::istreambuf_iterator<char>(tfs)),
                                     std::istreambuf_iterator<char>());

            std::string rendered = env.render(tmpl_content, ctx);

            // Output filename: strip .j2 suffix, e.g.
            // root.cmake.j2 -> CMakeLists.txt
            std::string out_name = "CMakeLists.txt";
            if (fname != "root.cmake.j2") {
                out_name = fname.substr(0, fname.size() - 3);
            }

            fs::path out_path = out_abs / out_name;
            write_file(out_path, rendered);
            ++files_generated;

            std::cout << "[cmake-gen] Generated: " << out_path << "\n";
        }

        std::cout << "\n[cmake-gen] Summary:\n"
                  << "  Sources discovered: " << total_sources << "\n"
                  << "  Files generated:    " << files_generated << "\n";

    } catch (const std::exception& ex) {
        std::cerr << "[cmake-gen] Error: " << ex.what() << "\n";
        return EXIT_FAILURE;
    }

    return EXIT_SUCCESS;
}
