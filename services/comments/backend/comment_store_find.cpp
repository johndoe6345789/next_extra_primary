/**
 * @file comment_store_find.cpp
 * @brief Single-row lookup used by moderation
 *        re-emit paths to refresh search docs.
 */

#include "CommentStore.h"
#include <drogon/orm/Result.h>

namespace services::comments
{

using drogon::orm::Result;
using drogon::orm::Row;

/** @brief Hydrate one CommentRow from a DB row. */
static CommentRow rowToCommentLocal(const Row& r)
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

void CommentStore::findById(
    std::int64_t id, RowCb ok, ErrCb err)
{
    const auto sql =
        "SELECT * FROM comments_v2 WHERE id=$1";
    db()->execSqlAsync(
        sql,
        [ok, err](const Result& res) {
            if (res.empty()) {
                err(drogon::k404NotFound,
                    "comment not found");
                return;
            }
            ok(rowToCommentLocal(res[0]));
        },
        [err](const drogon::orm::DrogonDbException& e) {
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        id);
}

} // namespace services::comments
