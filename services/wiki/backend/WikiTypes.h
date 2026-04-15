#pragma once
/**
 * @file WikiTypes.h
 * @brief Shared aliases and row structs for the
 *        collaborative wiki service.
 */

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>
#include <cstdint>
#include <functional>
#include <optional>
#include <string>

namespace services::wiki
{

using json = nlohmann::json;

/** @brief Success callback carrying a JSON body. */
using Callback = std::function<void(json)>;

/** @brief Error callback with status + message. */
using ErrCallback = std::function<void(
    drogon::HttpStatusCode, std::string)>;

/**
 * @brief Minimal in-memory view of a wiki page row.
 */
struct PageRow
{
    std::int64_t id{0};
    std::optional<std::int64_t> parentId;
    std::string tenantId;
    std::string slug;
    std::string title;
    std::string bodyMd;
    std::string path;
    int depth{0};
    std::string updatedAt;
};

/**
 * @brief Revision row as stored in wiki_revisions.
 */
struct RevisionRow
{
    std::int64_t pageId{0};
    int rev{0};
    std::string title;
    std::string bodyMd;
    std::string at;
    std::string authorId;
};

} // namespace services::wiki
