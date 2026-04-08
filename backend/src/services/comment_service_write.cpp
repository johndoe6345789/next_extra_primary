/**
 * @file comment_service_write.cpp
 * @brief CommentService write operations: create, remove.
 */

#include "comment_service.h"
#include <spdlog/spdlog.h>

namespace services
{

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
