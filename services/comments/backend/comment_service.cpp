/**
 * @file comment_service.cpp
 * @brief CommentService read operations: list.
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

} // namespace services
