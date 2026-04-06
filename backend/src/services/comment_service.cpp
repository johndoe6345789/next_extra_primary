/**
 * @file comment_service.cpp
 * @brief Implementation of CommentService.
 */

#include "comment_service.h"
#include <cstdint>
#include <spdlog/spdlog.h>

namespace services
{

void CommentService::list(
    int limit, int offset,
    Callback ok, ErrCallback err)
{
    static const std::string kSql = R"(
        SELECT c.id, c.content,
               c.created_at,
               u.username,
               u.display_name
        FROM comments c
        JOIN users u ON u.id = c.user_id
        ORDER BY c.created_at DESC
        LIMIT $1 OFFSET $2
    )";

    auto lim = static_cast<std::int64_t>(limit);
    auto off = static_cast<std::int64_t>(offset);
    *db() << kSql << lim << off >>
        [ok](const drogon::orm::Result& r) {
            auto items = nlohmann::json::array();
            for (const auto& row : r)
            {
                items.push_back({
                    {"id", row["id"].as<std::string>()},
                    {"content",
                     row["content"].as<std::string>()},
                    {"username",
                     row["username"].as<std::string>()},
                    {"displayName",
                     row["display_name"]
                         .as<std::string>()},
                    {"createdAt",
                     row["created_at"]
                         .as<std::string>()},
                });
            }
            ok({{"comments", items}});
        } >>
        [err](const drogon::orm::DrogonDbException& e) {
            spdlog::error("list comments: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                "Failed to list comments");
        };
}

void CommentService::create(
    const std::string& userId,
    const std::string& content,
    Callback ok, ErrCallback err)
{
    static const std::string kSql = R"(
        INSERT INTO comments (user_id, content)
        VALUES ($1, $2)
        RETURNING id, content, created_at
    )";

    *db() << kSql << userId << content >>
        [ok](const drogon::orm::Result& r) {
            const auto& row = r[0];
            ok({
                {"id", row["id"].as<std::string>()},
                {"content",
                 row["content"].as<std::string>()},
                {"createdAt",
                 row["created_at"]
                     .as<std::string>()},
            });
        } >>
        [err](const drogon::orm::DrogonDbException& e) {
            spdlog::error("create comment: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                "Failed to create comment");
        };
}

void CommentService::remove(
    const std::string& commentId,
    const std::string& userId,
    Callback ok, ErrCallback err)
{
    static const std::string kSql = R"(
        DELETE FROM comments
        WHERE id = $1 AND user_id = $2
    )";

    *db() << kSql << commentId << userId >>
        [ok, commentId](
            const drogon::orm::Result& r) {
            if (r.affectedRows() == 0)
            {
                ok({{"deleted", false}});
                return;
            }
            ok({{"deleted", true},
                {"id", commentId}});
        } >>
        [err](const drogon::orm::DrogonDbException& e) {
            spdlog::error("delete comment: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                "Failed to delete comment");
        };
}

} // namespace services
