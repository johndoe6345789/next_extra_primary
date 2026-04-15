/**
 * @file comment_store_read.cpp
 * @brief Read-side queries for CommentStore.
 */

#include "CommentStore.h"
#include <drogon/orm/Result.h>

namespace services::comments
{

using drogon::orm::Result;
using drogon::orm::Row;

/** @brief Hydrate a CommentRow from a DB row. */
static CommentRow rowToComment(const Row& r)
{
    CommentRow c;
    c.id = r["id"].as<std::int64_t>();
    if (!r["tenant_id"].isNull())
        c.tenantId =
            r["tenant_id"].as<std::string>();
    c.targetType =
        r["target_type"].as<std::string>();
    c.targetId =
        r["target_id"].as<std::string>();
    if (!r["parent_id"].isNull())
        c.parentId =
            r["parent_id"].as<std::int64_t>();
    c.authorId =
        r["author_id"].as<std::string>();
    c.body = r["body"].as<std::string>();
    if (!r["path"].isNull())
        c.path = r["path"].as<std::string>();
    c.depth = r["depth"].as<int>();
    c.flagCount = r["flag_count"].as<int>();
    c.createdAt =
        r["created_at"].as<std::string>();
    c.updatedAt =
        r["updated_at"].as<std::string>();
    if (!r["deleted_at"].isNull())
        c.deletedAt =
            r["deleted_at"].as<std::string>();
    return c;
}

void CommentStore::listForTarget(
    const std::string& targetType,
    const std::string& targetId,
    int limit, int offset,
    RowsCb ok, ErrCb err)
{
    const auto sql =
        "SELECT * FROM comments_v2 "
        "WHERE target_type=$1 "
        "AND target_id=$2 "
        "AND deleted_at IS NULL "
        "ORDER BY path ASC "
        "LIMIT $3 OFFSET $4";
    db()->execSqlAsync(
        sql,
        [ok](const Result& res) {
            Rows out;
            for (const auto& r : res)
                out.push_back(rowToComment(r));
            ok(std::move(out));
        },
        [err](const drogon::orm::DrogonDbException& e) {
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        targetType, targetId, limit, offset);
}

void CommentStore::listFlagged(
    int limit, int offset,
    RowsCb ok, ErrCb err)
{
    const auto sql =
        "SELECT * FROM comments_v2 "
        "WHERE flag_count > 0 "
        "AND deleted_at IS NULL "
        "ORDER BY flag_count DESC, id DESC "
        "LIMIT $1 OFFSET $2";
    db()->execSqlAsync(
        sql,
        [ok](const Result& res) {
            Rows out;
            for (const auto& r : res)
                out.push_back(rowToComment(r));
            ok(std::move(out));
        },
        [err](const drogon::orm::DrogonDbException& e) {
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        limit, offset);
}

} // namespace services::comments
