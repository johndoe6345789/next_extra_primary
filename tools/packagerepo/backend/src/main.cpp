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

    auto s3Endpoint = env("S3_ENDPOINT", "http://localhost:9000");
    auto s3Bucket = env("S3_BUCKET", "packagerepo");
    auto s3Key = env("S3_ACCESS_KEY", "minioadmin");
    auto secret = env("JWT_SECRET", "dev-secret-key");
    auto dbConn =
        env("DATABASE_URL", "host=localhost port=5432 dbname=packagerepo "
                            "user=packagerepo password=packagerepo");

    // Init DB and config (no HTTP needed, safe before event loop)
    repo::Globals::initConfig(s3Endpoint, s3Bucket, s3Key, secret, dbConn);

    // Load schema.json for the /schema endpoint
    for (auto p : {fs::path("/app/schema.json"), fs::path("schema.json")}) {
        if (fs::exists(p)) {
            std::ifstream f(p);
            repo::Globals::schemaJson = {std::istreambuf_iterator<char>(f),
                                         std::istreambuf_iterator<char>()};
            break;
        }
    }

    auto port = std::stoi(env("PORT", "5000"));
    drogon::app()
        .setLogLevel(trantor::Logger::kTrace)
        .setClientMaxBodySize(512 * 1024 * 1024)  // 512 MB
        .addListener("0.0.0.0", (uint16_t)port)
        .setThreadNum(4)
        .registerBeginningAdvice([] { repo::Globals::initS3(); })
        .run();

    return 0;
}
