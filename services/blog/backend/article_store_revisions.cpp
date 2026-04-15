/**
 * @file article_store_revisions.cpp
 * @brief Revision history reader for ArticleStore.
 */

#include "ArticleStore.h"

#include <drogon/orm/DbClient.h>

namespace nextra::blog
{

std::vector<Article> ArticleStore::revisions(
    std::int64_t id) const
{
    auto rows = db_->execSqlSync(
        "SELECT rev,title,body_md,at,author_id "
        "FROM article_revisions WHERE article_id=$1 "
        "ORDER BY rev DESC", id);
    std::vector<Article> out;
    for (const auto& r : rows)
    {
        Article a;
        a.id        = id;
        a.title     = r["title"].as<std::string>();
        a.bodyMd    = r["body_md"].as<std::string>();
        a.authorId  = r["author_id"].as<std::string>();
        a.updatedAt = r["at"].as<std::string>();
        out.push_back(std::move(a));
    }
    return out;
}

}  // namespace nextra::blog
