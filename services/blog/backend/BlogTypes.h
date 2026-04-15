#pragma once

/**
 * @file BlogTypes.h
 * @brief Plain value types for the article/blog daemon.
 */

#include <cstdint>
#include <optional>
#include <string>
#include <vector>

namespace nextra::blog
{

/// Lifecycle states of an article row.
enum class ArticleStatus
{
    Draft,
    Scheduled,
    Published,
    Archived
};

/**
 * @struct Article
 * @brief In-memory mirror of one articles row.
 */
struct Article
{
    std::int64_t id{0};
    std::string tenantId;
    std::string authorId;
    std::string slug;
    std::string title;
    std::string bodyMd;
    std::string bodyHtml;
    std::optional<std::string> heroImage;
    std::vector<std::string> tags;
    ArticleStatus status{ArticleStatus::Draft};
    std::optional<std::string> publishedAt;
    std::optional<std::string> scheduledAt;
    std::string createdAt;
    std::string updatedAt;
};

/// Convert an @ref ArticleStatus to its SQL spelling.
std::string statusToString(ArticleStatus s);

/// Parse a SQL status string; defaults to Draft on bad input.
ArticleStatus statusFromString(const std::string& s);

}  // namespace nextra::blog
