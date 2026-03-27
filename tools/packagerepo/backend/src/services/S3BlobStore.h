/**
 * @file S3BlobStore.h
 * @brief SHA256 content-addressed blob storage backed by S3.
 *
 * Drop-in replacement for BlobStore that stores blobs in an
 * S3-compatible server (e.g. tools/s3server) instead of the
 * local filesystem.
 */

#pragma once

#include <openssl/sha.h>

#include <drogon/HttpClient.h>

#include <iomanip>
#include <sstream>
#include <string>

namespace repo
{

class S3BlobStore
{
  public:
    /// @param endpoint  S3 server URL (e.g. http://s3:9000)
    /// @param bucket    Bucket name to use for blobs
    /// @param accessKey S3 access key
    S3BlobStore(const std::string& endpoint, const std::string& bucket,
                const std::string& accessKey);

    /// @brief Compute SHA256 digest of data.
    static std::string sha256(const std::string& data);

    /// @brief Store blob, return {digest, size}.
    std::pair<std::string, size_t> store(const std::string& data);

    /// @brief Read blob by digest, empty if missing.
    std::string read(const std::string& digest) const;

    /// @brief Check if blob exists via HEAD.
    bool exists(const std::string& digest) const;

  private:
    std::string endpoint_;
    std::string bucket_;
    std::string accessKey_;

    /// @brief Strip "sha256:" prefix from digest.
    static std::string stripPrefix(const std::string& d);
};

} // namespace repo
