/**
 * @file Globals.h
 * @brief Shared service instances and configuration.
 */

#pragma once

#include "DbPool.h"
#include "PgConfigStore.h"
#include "PgUserStore.h"
#include "S3BlobStore.h"

#include <filesystem>
#include <memory>
#include <string>

namespace repo
{

/// @brief Global service singletons, initialised in main.
struct Globals {
    static inline std::unique_ptr<S3BlobStore> blobs;
    static inline std::string jwtSecret;
    static inline std::string schemaJson;
    static inline int repoType = 0;

    /// @brief Initialize all services.
    static void init(const std::string& s3Endpoint, const std::string& s3Bucket,
                     const std::string& s3AccessKey, const std::string& secret,
                     const std::string& dbConn)
    {
        blobs =
            std::make_unique<S3BlobStore>(s3Endpoint, s3Bucket, s3AccessKey);
        jwtSecret = secret;

        DbPool::init(dbConn);
        PgUserStore::init();
        repoType = PgConfigStore::defaultRepoType();
    }
};

} // namespace repo
