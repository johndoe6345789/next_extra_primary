/**
 * @file Globals.h
 * @brief Shared service instances and configuration.
 */

#pragma once

#include "BlobStore.h"
#include "DbPool.h"
#include "PgConfigStore.h"
#include "PgUserStore.h"

#include <filesystem>
#include <memory>
#include <string>

namespace repo
{

/// @brief Global service singletons, initialised in main.
struct Globals
{
    static inline std::unique_ptr<BlobStore> blobs;
    static inline std::string jwtSecret;
    static inline std::string schemaJson;
    static inline int repoType = 0;

    /// @brief Initialize all services.
    static void init(const std::filesystem::path& dataDir,
                     const std::string& secret,
                     const std::string& dbConn)
    {
        namespace fs = std::filesystem;
        fs::create_directories(dataDir);
        blobs = std::make_unique<BlobStore>(
            dataDir / "blobs");
        jwtSecret = secret;

        DbPool::init(dbConn);
        PgUserStore::init();
        repoType = PgConfigStore::defaultRepoType();
    }
};

} // namespace repo
