/** @brief Thread-level SQL helpers for the forum. */

#include "ForumController.h"
#include <drogon/orm/Row.h>
#include <nlohmann/json.hpp>
#include <string>

using json = nlohmann::json;

namespace controllers
{

/** Thread list row → JSON (used by list endpoint). */
json threadRowToJson(const drogon::orm::Row& row)
{
    auto str = [&](const char* c,
                   const char* def = "") {
        return row[c].isNull() ? std::string{def}
            : row[c].as<std::string>();
    };
    auto i64 = [&](const char* c) {
        return row[c].as<std::int64_t>();
    };
    return {
        {"id",         std::to_string(i64("id"))},
        {"title",      str("title")},
        {"board",      str("board", "general")},
        {"author",     str("author_id")},
        {"authorName", str("author_name")},
        {"authorPostCount",
            row["author_post_count"].as<std::int64_t>()},
        {"createdAt",  str("created_at")},
        {"replyCount", i64("reply_count")},
        {"lastReplyAt",str("last_reply_at")},
    };
}

/** Build the optional board-filter WHERE clause. */
std::string boardFilterClause(const std::string& board)
{
    if (board.empty()) return {};
    std::string esc;
    esc.reserve(board.size());
    for (char c : board) {
        if (c == '\'') esc += "''";
        else esc += c;
    }
    return "  AND t.target_id = '" + esc + "' ";
}

/** Paginated thread-list SELECT. */
std::string threadListSql(
    const std::string& boardClause,
    int limit, int offset)
{
    return std::string{}
        + "SELECT t.id, t.title, t.target_id AS board,"
        + " t.author_id, t.created_at,"
        + " u.display_name AS author_name,"
        + " (SELECT COUNT(*) FROM comments_v2"
        + "  WHERE author_id=t.author_id"
        + "  AND deleted_at IS NULL) AS author_post_count,"
        + " (SELECT COUNT(*) FROM comments_v2 p"
        + "  WHERE p.target_type='forum_thread'"
        + "  AND p.target_id=t.id::text"
        + "  AND p.deleted_at IS NULL) AS reply_count,"
        + " (SELECT MAX(p.created_at) FROM comments_v2 p"
        + "  WHERE p.target_type='forum_thread'"
        + "  AND p.target_id=t.id::text"
        + "  AND p.deleted_at IS NULL) AS last_reply_at"
        + " FROM comments_v2 t"
        + " LEFT JOIN users u ON u.id=t.author_id"
        + " WHERE t.target_type='forum_board'"
        + "   AND t.deleted_at IS NULL "
        + boardClause
        + "ORDER BY t.created_at DESC"
        + " LIMIT "  + std::to_string(limit)
        + " OFFSET " + std::to_string(offset);
}

/** COUNT of non-deleted threads (optionally filtered). */
std::string threadCountSql(
    const std::string& boardClause)
{
    return std::string{}
        + "SELECT COUNT(*) AS n FROM comments_v2 t"
        + " WHERE t.target_type='forum_board'"
        + "   AND t.deleted_at IS NULL "
        + boardClause;
}

} // namespace controllers
