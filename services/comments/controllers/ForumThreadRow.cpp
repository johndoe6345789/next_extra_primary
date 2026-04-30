/** @brief Helpers for ForumController list/detail.
 *  Row → JSON, SQL fragment builders. */
#include "ForumController.h"
#include <drogon/orm/Result.h>
#include <drogon/orm/Row.h>
#include <nlohmann/json.hpp>
#include <string>

using json = nlohmann::json;

namespace controllers
{

json threadRowToJson(const drogon::orm::Row& row)
{
    auto str = [&](const char* c, const char* def = "") {
        return row[c].isNull() ? std::string{def}
            : row[c].as<std::string>();
    };
    return {
        {"id", std::to_string(
            row["id"].as<std::int64_t>())},
        {"title", str("title")},
        {"board", str("board", "general")},
        {"author", str("author_id")},
        {"authorName", str("author_name")},
        {"createdAt", str("created_at")},
        {"replyCount",
            row["reply_count"].as<std::int64_t>()},
        {"lastReplyAt", str("last_reply_at")},
    };
}

/** Build the optional `AND t.target_id = '...'`
 *  clause for filtering threads by board. */
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

/** Full SELECT for the thread list (paginated). */
std::string threadListSql(const std::string& boardClause,
    int limit, int offset)
{
    return std::string{}
        + "SELECT t.id, t.title, t.target_id AS board, "
        + "  t.author_id, t.created_at, "
        + "  u.display_name AS author_name, "
        + " (SELECT COUNT(*) FROM comments_v2 p"
        + "  WHERE p.target_type='forum_thread'"
        + "  AND p.target_id=t.id::text"
        + "  AND p.deleted_at IS NULL) AS reply_count, "
        + " (SELECT MAX(p.created_at) FROM comments_v2 p"
        + "  WHERE p.target_type='forum_thread'"
        + "  AND p.target_id=t.id::text"
        + "  AND p.deleted_at IS NULL) AS last_reply_at "
        + "FROM comments_v2 t "
        + "LEFT JOIN users u ON u.id=t.author_id "
        + "WHERE t.target_type='forum_board' "
        + "  AND t.deleted_at IS NULL "
        + boardClause
        + "ORDER BY t.created_at DESC "
        + "LIMIT " + std::to_string(limit)
        + " OFFSET " + std::to_string(offset);
}

/** Full SELECT for the count of threads. */
std::string threadCountSql(const std::string& boardClause)
{
    return std::string{}
        + "SELECT COUNT(*) AS n FROM comments_v2 t "
        + "WHERE t.target_type='forum_board' "
        + "  AND t.deleted_at IS NULL "
        + boardClause;
}

/** Paginated SELECT of posts in a thread. */
std::string postListSql(int limit, int offset)
{
    return std::string{}
        + "SELECT p.id, p.parent_id, p.author_id, "
        + "  p.body, p.depth, p.created_at, "
        + "  u.display_name AS author_name "
        + "FROM comments_v2 p "
        + "LEFT JOIN users u ON u.id=p.author_id "
        + "WHERE p.target_type='forum_thread' "
        + "  AND p.target_id=$1 "
        + "  AND p.deleted_at IS NULL "
        + "ORDER BY p.path ASC "
        + "LIMIT " + std::to_string(limit)
        + " OFFSET " + std::to_string(offset);
}

/** COUNT(*) of non-deleted posts in a thread. */
std::string postCountSql()
{
    return "SELECT COUNT(*) AS n FROM comments_v2 "
           "WHERE target_type='forum_thread' "
           "  AND target_id=$1 "
           "  AND deleted_at IS NULL";
}

/** Single forum post row → JSON. */
json postRowToJson(const drogon::orm::Row& p,
    const std::string& threadId)
{
    auto optId = [&](const char* c) -> json {
        return p[c].isNull() ? json(nullptr)
            : json(std::to_string(
                p[c].as<std::int64_t>()));
    };
    auto str = [&](const char* c, const char* def = "") {
        return p[c].isNull() ? std::string{def}
            : p[c].as<std::string>();
    };
    return {{"id", optId("id")},
        {"threadId", threadId},
        {"parentId", optId("parent_id")},
        {"author", str("author_id")},
        {"authorName", str("author_name")},
        {"body", str("body")},
        {"depth", p["depth"].as<int>()},
        {"createdAt", str("created_at")}};
}

} // namespace controllers
