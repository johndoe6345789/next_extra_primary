/**
 * @file main.cpp
 * @brief Package repository server entry point.
 */

#include "services/Globals.h"

#include <drogon/drogon.h>

#include <cstdlib>
#include <filesystem>
#include <fstream>
#include <string>

static std::string env(const char* k, const char* def)
{
    auto v = std::getenv(k);
    return v ? v : def;
}

int main()
{
    namespace fs = std::filesystem;

    auto dataDir = fs::path(env("DATA_DIR", "/tmp/repo"));
    auto secret = env("JWT_SECRET", "dev-secret-key");
    auto dbConn = env("DATABASE_URL",
        "host=localhost port=5432 dbname=packagerepo "
        "user=packagerepo password=packagerepo");

    repo::Globals::init(dataDir, secret, dbConn);

    // Load schema.json for the /schema endpoint
    for (auto p : {fs::path("/app/schema.json"),
                   fs::path("schema.json")}) {
        if (fs::exists(p)) {
            std::ifstream f(p);
            repo::Globals::schemaJson = {
                std::istreambuf_iterator<char>(f),
                std::istreambuf_iterator<char>()};
            break;
        }
    }

    auto port = std::stoi(env("PORT", "5000"));
    drogon::app()
        .setLogLevel(trantor::Logger::kInfo)
        .addListener("0.0.0.0", (uint16_t)port)
        .setThreadNum(4)
        .run();

    return 0;
}
