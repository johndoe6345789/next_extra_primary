/**
 * @file comment_store_write.cpp
 * @brief Write-side queries for CommentStore.
 *        Auto-derives ltree path from parent.
 */

#include "CommentStore.h"
#include <drogon/orm/Result.h>

namespace services::comments
{

using drogon::orm::Result;

/**
 * @brief Insert a comment; path is computed as
 *        parent.path || id when a parent is
 *        given, else text(id).
 */
void CommentStore::insert(
    const CreateCommentInput& in,
    RowCb ok, ErrCb err)
{
    const auto sql =
        "WITH ins AS ("
        "  INSERT INTO comments_v2 ("
        "    tenant_id, target_type,"
        "    target_id, parent_id,"
        "    author_id, body, depth"
        "  ) VALUES ("
        "    $1::uuid, $2, $3, $4,"
        "    $5::uuid, $6,"
        "    COALESCE("
        "      (SELECT depth+1 FROM comments_v2"
        "       WHERE id=$4), 0)"
        "  ) RETURNING *"
        "), upd AS ("
        "  UPDATE comments_v2 c"
        "  SET path = ("
        "    SELECT CASE WHEN p.path IS NULL"
        "      THEN text2ltree(c.id::text)"
        "      ELSE p.path ||"
        "           text2ltree(c.id::text)"
        "    END"
        "    FROM comments_v2 p"
        "    WHERE p.id = c.parent_id"
        "       OR c.parent_id IS NULL"
        "    LIMIT 1)"
        "  FROM ins"
        "  WHERE c.id = ins.id"
        "  RETURNING c.*)"
        "SELECT * FROM upd";
    db()->execSqlAsync(
        sql,
        [ok, err](const Result& res) {
            if (res.empty()) {
                err(drogon::k500InternalServerError,
                    "insert failed");
                return;
            }
            CommentRow c;
            const auto& r = res[0];
            c.id = r["id"].as<std::int64_t>();
            c.targetType =
                r["target_type"].as<std::string>();
            c.targetId =
                r["target_id"].as<std::string>();
            c.authorId =
                r["author_id"].as<std::string>();
            c.body = r["body"].as<std::string>();
            if (!r["path"].isNull())
                c.path =
                    r["path"].as<std::string>();
            c.depth = r["depth"].as<int>();
            c.flagCount =
                r["flag_count"].as<int>();
            c.createdAt =
                r["created_at"].as<std::string>();
            c.updatedAt =
                r["updated_at"].as<std::string>();
            ok(std::move(c));
        },
        [err](const drogon::orm::DrogonDbException& e) {
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        in.tenantId.value_or(""),
        in.targetType, in.targetId,
        in.parentId.value_or(0),
        in.authorId, in.body);
}

} // namespace services::comments
