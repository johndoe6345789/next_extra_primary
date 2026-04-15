/**
 * @file article_store_write.cpp
 * @brief Write-side implementation of ArticleStore.
 */

#include "ArticleStore.h"

#include <drogon/orm/DbClient.h>

namespace nextra::blog
{

std::int64_t ArticleStore::create(const Article& a)
{
    auto rows = db_->execSqlSync(
        "INSERT INTO articles (tenant_id,author_id,slug,"
        "title,body_md,body_html,hero_image,status,"
        "scheduled_at) VALUES "
        "($1::uuid,$2::uuid,$3,$4,$5,$6,$7,$8,"
        "$9::timestamptz) RETURNING id",
        a.tenantId, a.authorId, a.slug, a.title,
        a.bodyMd, a.bodyHtml,
        a.heroImage.value_or(std::string{}),
        statusToString(a.status),
        a.scheduledAt.value_or(std::string{}));
    auto id = rows[0]["id"].as<std::int64_t>();
    db_->execSqlSync(
        "INSERT INTO article_revisions "
        "(article_id,rev,title,body_md,author_id) "
        "VALUES ($1,1,$2,$3,$4::uuid)",
        id, a.title, a.bodyMd, a.authorId);
    return id;
}

bool ArticleStore::update(
    std::int64_t id, const Article& p)
{
    auto rows = db_->execSqlSync(
        "UPDATE articles SET title=$1, body_md=$2, "
        "body_html=$3, hero_image=NULLIF($4,''), "
        "status=$5, scheduled_at=NULLIF($6,'')"
        "::timestamptz, updated_at=now() "
        "WHERE id=$7 RETURNING id",
        p.title, p.bodyMd, p.bodyHtml,
        p.heroImage.value_or(std::string{}),
        statusToString(p.status),
        p.scheduledAt.value_or(std::string{}),
        id);
    if (rows.empty()) return false;
    auto rev = db_->execSqlSync(
        "SELECT COALESCE(MAX(rev),0)+1 AS n "
        "FROM article_revisions WHERE article_id=$1",
        id);
    auto n = rev[0]["n"].as<int>();
    db_->execSqlSync(
        "INSERT INTO article_revisions "
        "(article_id,rev,title,body_md,author_id) "
        "VALUES ($1,$2,$3,$4,$5::uuid)",
        id, n, p.title, p.bodyMd, p.authorId);
    return true;
}

bool ArticleStore::remove(std::int64_t id)
{
    auto rows = db_->execSqlSync(
        "DELETE FROM articles WHERE id=$1 RETURNING id",
        id);
    return !rows.empty();
}

int ArticleStore::publishDue()
{
    auto rows = db_->execSqlSync(
        "UPDATE articles "
        "SET status='published', published_at=now(), "
        "updated_at=now() "
        "WHERE status='scheduled' "
        "  AND scheduled_at IS NOT NULL "
        "  AND scheduled_at <= now() "
        "RETURNING id");
    return static_cast<int>(rows.size());
}

}  // namespace nextra::blog
