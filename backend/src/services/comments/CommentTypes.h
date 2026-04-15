#pragma once
/**
 * @file CommentTypes.h
 * @brief Value types for the polymorphic
 *        threaded comment system.
 */

#include <nlohmann/json.hpp>
#include <cstdint>
#include <optional>
#include <string>
#include <vector>

namespace services::comments
{

using json = nlohmann::json;

/**
 * @brief Flat comment row from the DB.
 */
struct CommentRow
{
    std::int64_t id{0};
    std::optional<std::string> tenantId;
    std::string targetType;
    std::string targetId;
    std::optional<std::int64_t> parentId;
    std::string authorId;
    std::string body;
    std::string path;
    int depth{0};
    int flagCount{0};
    std::string createdAt;
    std::string updatedAt;
    std::optional<std::string> deletedAt;

    /** @brief Serialize to JSON. */
    [[nodiscard]] json toJson() const;
};

/**
 * @brief Request input for creating a comment.
 */
struct CreateCommentInput
{
    std::string targetType;
    std::string targetId;
    std::optional<std::int64_t> parentId;
    std::string authorId;
    std::string body;
    std::optional<std::string> tenantId;
};

/** @brief A moderator action kind. */
enum class ModAction
{
    Hide,
    Unhide,
    Delete,
    ClearFlags
};

} // namespace services::comments
