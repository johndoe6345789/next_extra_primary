/**
 * @file SetupExoticArchCmd.cpp
 * @brief Patches node_modules for exotic-arch Docker builds.
 */

#include "SetupExoticArchCmd.h"

#include <fmt/core.h>

#include <cstdlib>
#include <filesystem>
#include <fstream>
#include <regex>
#include <string>

namespace fs = std::filesystem;

namespace manager
{

/// Write @a content to @a path, creating parent dirs.
static void writeFile(const fs::path& path,
                      const std::string& content)
{
    fs::create_directories(path.parent_path());
    std::ofstream(path) << content;
}

/// Install cached @next/swc .node files from @a swcDir.
static void installSwcNative(const fs::path& swcDir,
                             const fs::path& nm)
{
    if (!fs::is_directory(swcDir)) return;

    std::regex re(R"(^next-swc\.(.+)\.node$)");
    for (auto& e : fs::directory_iterator(swcDir)) {
        std::smatch m;
        auto name = e.path().filename().string();
        if (!std::regex_match(name, m, re)) continue;

        auto triple = m[1].str();
        auto pkg = nm / "@next" / ("swc-" + triple);
        fs::create_directories(pkg);
        fs::copy_file(e.path(), pkg / name,
                      fs::copy_options::overwrite_existing);
        writeFile(pkg / "package.json",
                  "{\"name\":\"@next/swc-" + triple +
                      "\",\"main\":\"" + name + "\"}\n");
        fmt::print("Installed @next/swc-{}\n", triple);
    }
}

/// Stub @parcel/watcher with a no-op implementation.
static void stubParcelWatcher(const fs::path& nm)
{
    auto dir = nm / "@parcel" / "watcher";
    if (std::system("node -e \"require('@parcel/watcher')\" "
                    "2>/dev/null") == 0) {
        return;
    }
    writeFile(dir / "package.json",
              "{\"name\":\"@parcel/watcher\","
              "\"main\":\"index.js\"}\n");
    writeFile(dir / "index.js",
              "exports.subscribe=async()=>"
              "({unsubscribe:async()=>{}});\n"
              "exports.getEventsSince=async()=>[];\n");
    fmt::print("Stubbed @parcel/watcher\n");
}

/// Patch nested @swc/core to fall back to @swc/wasm.
static void patchSwcCore(const fs::path& nm)
{
    std::system("npm install --no-save @swc/wasm");

    for (auto& e : fs::recursive_directory_iterator(nm)) {
        if (e.path().filename() != "binding.js") continue;
        if (e.path().parent_path().filename() != "core")
            continue;
        auto parent = e.path().parent_path();
        if (parent.parent_path().filename() != "@swc")
            continue;

        auto cmd = "node -e \"require('" +
                   parent.string() + "')\" 2>/dev/null";
        if (std::system(cmd.c_str()) == 0) continue;

        writeFile(e.path(),
                  "module.exports=require(\"@swc/wasm\");\n");
        auto rel = fs::relative(e.path(), nm).string();
        fmt::print("Patched {}\n", rel);
    }
}

int SetupExoticArchCmd::execute(const std::string& swcDir,
                                const std::string& nmDir)
{
    fs::path nm(nmDir);
    installSwcNative(fs::path(swcDir), nm);
    stubParcelWatcher(nm);
    patchSwcCore(nm);
    return 0;
}

} // namespace manager
