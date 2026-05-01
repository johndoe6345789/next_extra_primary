/**
 * @file article_store_read.cpp
 * @brief Read-side implementation of ArticleStore.
 */

#include "ArticleStore.h"

#include <drogon/orm/DbClient.h>

namespace nextra::blog
{

using drogon::orm::Row;

static Article rowToArticle(const Row& r)
{
    Article a;
    a.id        = r["id"].as<std::int64_t>();
    a.tenantId  = r["tenant_id"].as<std::string>();
    a.authorId  = r["author_id"].as<std::string>();
    a.slug      = r["slug"].as<std::string>();
    a.title     = r["title"].as<std::string>();
    a.bodyMd    = r["body_md"].as<std::string>();
    a.bodyHtml  = r["body_html"].as<std::string>();
    if (!r["hero_image"].isNull())
        a.heroImage = r["hero_image"].as<std::string>();
    a.status    = statusFromString(
        r["status"].as<std::string>());
    if (!r["published_at"].isNull())
        a.publishedAt = r["published_at"].as<std::string>();
    if (!r["scheduled_at"].isNull())
        a.scheduledAt = r["scheduled_at"].as<std::string>();
    a.createdAt = r["created_at"].as<std::string>();
    a.updatedAt = r["updated_at"].as<std::string>();
    return a;
}

ArticleStore::ArticleStore(
    std::shared_ptr<drogon::orm::DbClient> db)
    : db_(std::move(db)) {}

std::vector<Article> ArticleStore::list(
    const ListFilter& f) const
{
    std::string sql =
        "SELECT id,tenant_id,author_id,slug,title,"
        "body_md,body_html,hero_image,status,"
        "published_at,scheduled_at,created_at,updated_at "
        "FROM articles";
    if (f.status)
        sql += " WHERE status='"
             + statusToString(*f.status) + "'";
    sql += " ORDER BY created_at DESC LIMIT "
         + std::to_string(f.limit)
         + " OFFSET "
         + std::to_string(f.offset);
    auto rows = db_->execSqlSync(sql);
    std::vector<Article> out;
    out.reserve(rows.size());
    for (const auto& r : rows) out.push_back(rowToArticle(r));
    return out;
}

std::optional<Article> ArticleStore::getById(
    std::int64_t id) const
{
    auto rows = db_->execSqlSync(
        "SELECT id,tenant_id,author_id,slug,title,body_md,"
        "body_html,hero_image,status,published_at,"
        "scheduled_at,created_at,updated_at "
        "FROM articles WHERE id=$1", id);
    if (rows.empty()) return std::nullopt;
    return rowToArticle(rows[0]);
}

std::optional<Article> ArticleStore::getBySlug(
    const std::string& slug) const
{
    auto rows = db_->execSqlSync(
        "SELECT id,tenant_id,author_id,slug,title,body_md,"
        "body_html,hero_image,status,published_at,"
        "scheduled_at,created_at,updated_at "
        "FROM articles WHERE slug=$1", slug);
    if (rows.empty()) return std::nullopt;
    return rowToArticle(rows[0]);
}

int ArticleStore::count(const ListFilter& f) const
{
    std::string sql = "SELECT COUNT(*) FROM articles";
    if (f.status)
        sql += " WHERE status='"
             + statusToString(*f.status) + "'";
    auto rows = db_->execSqlSync(sql);
    if (rows.empty()) return 0;
    return rows[0][0].as<int>();
}

}  // namespace nextra::blog
