#pragma once

/**
 * @file MediamtxClient.h
 * @brief Thin HTTP client for the mediamtx :9997 control API.
 *
 * mediamtx exposes a small REST surface to list active paths and
 * kick publishers/readers.  We only touch it through this client so
 * the rest of the daemon stays decoupled from mediamtx's JSON shape.
 * All calls are synchronous Drogon HTTP client calls issued from the
 * controller event loop — mediamtx is co-located, the RTT is a
 * microseconds-scale loopback hop.
 */

#include <nlohmann/json.hpp>

#include <string>
#include <vector>

namespace nextra::streaming
{

/// One active path as reported by GET /v3/paths/list.
struct PathInfo
{
    std::string name;
    bool ready{false};
    std::string source;       // e.g. "rtspSession"
    std::int64_t bytesRx{0};
    std::int64_t readers{0};
};

/**
 * @class MediamtxClient
 * @brief Tiny wrapper over mediamtx's /v3 admin endpoints.
 */
class MediamtxClient
{
public:
    explicit MediamtxClient(std::string baseUrl);

    /// Return every path mediamtx currently knows about.
    std::vector<PathInfo> listPaths();

    /// Force-disconnect a publisher on @p path.  Returns true on 2xx.
    bool kickPublisher(const std::string& path);

    /// Force-disconnect a single reader by id.  Returns true on 2xx.
    bool kickReader(const std::string& readerId);

private:
    std::string baseUrl_;
};

}  // namespace nextra::streaming
