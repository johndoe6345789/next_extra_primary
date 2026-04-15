/**
 * @file blog_types.cpp
 * @brief Status enum <-> string helpers.
 */

#include "BlogTypes.h"

namespace nextra::blog
{

std::string statusToString(ArticleStatus s)
{
    switch (s)
    {
        case ArticleStatus::Draft:     return "draft";
        case ArticleStatus::Scheduled: return "scheduled";
        case ArticleStatus::Published: return "published";
        case ArticleStatus::Archived:  return "archived";
    }
    return "draft";
}

ArticleStatus statusFromString(const std::string& s)
{
    if (s == "scheduled") return ArticleStatus::Scheduled;
    if (s == "published") return ArticleStatus::Published;
    if (s == "archived")  return ArticleStatus::Archived;
    return ArticleStatus::Draft;
}

}  // namespace nextra::blog
