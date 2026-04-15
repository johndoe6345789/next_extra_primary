#pragma once

/**
 * @file S3Uploader.h
 * @brief Minimal S3 PUT client for image-processor variants.
 *
 * Targets the dev-mode @c tools/s3server which accepts a
 * simple static auth header. Production S3 / MinIO will
 * need real AWS Signature v4; see the TODO in upload().
 */

#include <cstdint>
#include <string>
#include <vector>

namespace nextra::image
{

/// @brief Runtime config loaded from environment variables.
struct S3Config
{
    std::string endpoint;
    std::string accessKey;
    std::string secretKey;
    std::string bucket;

    static S3Config fromEnv();
};

/// @brief Thin wrapper around a Drogon HTTP client PUT.
class S3Uploader
{
  public:
    explicit S3Uploader(S3Config cfg)
        : cfg_(std::move(cfg)) {}

    /**
     * @brief Upload bytes to @c {bucket}/{key}.
     * @param key      Target object key.
     * @param bytes    Payload buffer.
     * @param mimeType Content-type header value.
     * @return true on HTTP 2xx, false otherwise.
     */
    bool upload(const std::string& key,
                const std::vector<unsigned char>& bytes,
                const std::string& mimeType);

    /// @brief Accessor used by ImageProcessor for ledger urls.
    const S3Config& config() const { return cfg_; }

  private:
    S3Config cfg_;
};

}  // namespace nextra::image
