#pragma once

#include "Globals.h"

#include <drogon/utils/Utilities.h>

#include <filesystem>
#include <fstream>

namespace repo::registry_upload
{
namespace fs = std::filesystem;

inline fs::path root()
{
    auto dir = fs::temp_directory_path() / "packagerepo-registry";
    fs::create_directories(dir);
    return dir;
}

inline fs::path pathFor(const std::string& uuid) { return root() / uuid; }

inline std::string start()
{
    auto uuid = drogon::utils::getUuid();
    std::ofstream(pathFor(uuid), std::ios::binary);
    return uuid;
}

inline void cancel(const std::string& uuid) { fs::remove(pathFor(uuid)); }

inline int64_t size(const std::string& uuid)
{
    auto path = pathFor(uuid);
    return fs::exists(path) ? (int64_t)fs::file_size(path) : -1;
}

inline int64_t append(const std::string& uuid, const std::string& chunk)
{
    std::ofstream(pathFor(uuid), std::ios::binary | std::ios::app).write(
        chunk.data(), (long)chunk.size());
    return size(uuid);
}

inline std::string finalize(const std::string& uuid, const std::string& digest,
                            const std::string& tail)
{
    if (size(uuid) < 0) return {};
    if (!tail.empty()) append(uuid, tail);
    std::ifstream f(pathFor(uuid), std::ios::binary);
    std::string data{std::istreambuf_iterator<char>(f), {}};
    const auto actual = S3BlobStore::sha256(data);
    if (actual != digest) {
        fs::remove(pathFor(uuid));
        return {};
    }
    // Only remove the staging file if the store succeeds.
    // Empty first element of the pair signals S3 failure;
    // callers must return 400/500 so buildx retries and
    // we never advertise a blob we can't serve.
    auto stored = Globals::blobs->store(data);
    if (stored.first.empty()) return {};
    fs::remove(pathFor(uuid));
    return stored.first;
}
} // namespace repo::registry_upload
