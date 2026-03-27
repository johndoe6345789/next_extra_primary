/**
 * @file BlobStore.h
 * @brief Filesystem blob storage with MD5 ETag.
 */

#pragma once

#include <filesystem>
#include <fstream>
#include <iomanip>
#include <sstream>
#include <string>

#include <openssl/md5.h>

namespace s3
{

/// @brief Content-addressed filesystem blob store.
class BlobStore
{
public:
    explicit BlobStore(const std::filesystem::path& root)
        : root_(root)
    {
        std::filesystem::create_directories(root);
    }

    /// @brief Store data, return {etag, size, path}.
    struct StoreResult {
        std::string etag;
        size_t size;
        std::string path;
    };

    StoreResult store(const std::string& bucket,
                      const std::string& key,
                      const std::string& data)
    {
        auto etag = md5hex(data);
        auto dir = root_ / bucket;
        std::filesystem::create_directories(dir);

        // Use etag-based path to dedup
        auto rel = bucket + "/" + etag;
        auto full = root_ / rel;

        std::ofstream f(full, std::ios::binary);
        f.write(data.data(), (std::streamsize)data.size());
        f.close();

        return {etag, data.size(), rel};
    }

    /// @brief Read blob by storage path.
    std::string read(const std::string& path)
    {
        auto full = root_ / path;
        if (!std::filesystem::exists(full)) return {};
        std::ifstream f(full, std::ios::binary);
        return {std::istreambuf_iterator<char>(f),
                std::istreambuf_iterator<char>()};
    }

    /// @brief Delete blob by storage path.
    bool remove(const std::string& path)
    {
        return std::filesystem::remove(root_ / path);
    }

private:
    std::filesystem::path root_;

    static std::string md5hex(const std::string& data)
    {
        unsigned char hash[MD5_DIGEST_LENGTH];
        MD5((unsigned char*)data.data(),
            data.size(), hash);
        std::ostringstream ss;
        for (int i = 0; i < MD5_DIGEST_LENGTH; ++i)
            ss << std::hex << std::setfill('0')
               << std::setw(2) << (int)hash[i];
        return ss.str();
    }
};

} // namespace s3
