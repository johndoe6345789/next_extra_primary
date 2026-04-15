/**
 * @file comment_store_moderation.cpp
 * @brief Flag + moderation operations.
 */

#include "CommentStore.h"
#include <drogon/orm/Result.h>

namespace services::comments
{

using drogon::orm::Result;

void CommentStore::flag(
    std::int64_t commentId,
    const std::string& reporterId,
    const std::string& reason,
    ErrCb done)
{
    const auto sql =
        "WITH ins AS ("
        "  INSERT INTO comment_flags ("
        "    comment_id, reporter_id, reason)"
        "  VALUES ($1, $2::uuid, $3)"
        "  ON CONFLICT DO NOTHING"
        "  RETURNING 1)"
        "UPDATE comments_v2 SET "
        "  flag_count = flag_count + ("
        "    SELECT COUNT(*) FROM ins) "
        "WHERE id = $1";
    db()->execSqlAsync(
        sql,
        [done](const Result&) {
            done(drogon::k200OK, "ok");
        },
        [done](const drogon::orm::DrogonDbException& e) {
            done(drogon::k500InternalServerError,
                 e.base().what());
        },
        commentId, reporterId, reason);
}

void CommentStore::moderate(
    std::int64_t commentId,
    ModAction action,
    ErrCb done)
{
    std::string sql;
    switch (action) {
    case ModAction::Hide:
        sql = "UPDATE comments_v2 SET "
              "deleted_at = NOW() WHERE id=$1";
        break;
    case ModAction::Unhide:
        sql = "UPDATE comments_v2 SET "
              "deleted_at = NULL WHERE id=$1";
        break;
    case ModAction::Delete:
        sql = "DELETE FROM comments_v2 "
              "WHERE id=$1";
        break;
    case ModAction::ClearFlags:
        sql = "UPDATE comments_v2 SET "
              "flag_count=0 WHERE id=$1; "
              "DELETE FROM comment_flags "
              "WHERE comment_id=$1";
        break;
    }
    db()->execSqlAsync(
        sql,
        [done](const Result&) {
            done(drogon::k200OK, "ok");
        },
        [done](const drogon::orm::DrogonDbException& e) {
            done(drogon::k500InternalServerError,
                 e.base().what());
        },
        commentId);
}

} // namespace services::comments
