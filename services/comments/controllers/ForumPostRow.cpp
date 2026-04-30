/** @brief Post-level SQL helpers for the forum. */

#include "ForumController.h"
#include <drogon/orm/Row.h>
#include <nlohmann/json.hpp>
#include <string>

using json = nlohmann::json;

namespace controllers
{

/** Paginated SELECT of replies in a thread.
 *  Includes each author's total post count for
 *  rank display. */
std::string postListSql(int limit, int offset)
{
    return std::string{}
        + "SELECT p.id, p.parent_id, p.author_id,"
        + " p.body, p.depth, p.created_at,"
        + " u.display_name AS author_name,"
        + " (SELECT COUNT(*) FROM comments_v2"
        + "  WHERE author_id=p.author_id"
        + "  AND target_type IN ('forum_thread',"
        + "                      'forum_board')"
        + "  AND deleted_at IS NULL)"
        + "  AS author_post_count"
        + " FROM comments_v2 p"
        + " LEFT JOIN users u ON u.id=p.author_id"
        + " WHERE p.target_type='forum_thread'"
        + "   AND p.target_id=$1"
        + "   AND p.deleted_at IS NULL"
        + " ORDER BY p.path ASC"
        + " LIMIT "  + std::to_string(limit)
        + " OFFSET " + std::to_string(offset);
}

/** COUNT of non-deleted replies in a thread. */
std::string postCountSql()
{
    return "SELECT COUNT(*) AS n FROM comments_v2"
           " WHERE target_type='forum_thread'"
           "   AND target_id=$1"
           "   AND deleted_at IS NULL";
}

/** Single reply row → JSON. */
json postRowToJson(const drogon::orm::Row& p,
    const std::string& threadId)
{
    auto optId = [&](const char* c) -> json {
        return p[c].isNull() ? json(nullptr)
            : json(std::to_string(
                p[c].as<std::int64_t>()));
    };
    auto str = [&](const char* c,
                   const char* def = "") {
        return p[c].isNull() ? std::string{def}
            : p[c].as<std::string>();
    };
    return {
        {"id",              optId("id")},
        {"threadId",        threadId},
        {"parentId",        optId("parent_id")},
        {"author",          str("author_id")},
        {"authorName",      str("author_name")},
        {"authorPostCount",
            p["author_post_count"].as<std::int64_t>()},
        {"body",            str("body")},
        {"depth",           p["depth"].as<int>()},
        {"createdAt",       str("created_at")},
    };
}

} // namespace controllers
