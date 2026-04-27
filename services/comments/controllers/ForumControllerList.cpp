/**
 * @file ForumControllerList.cpp
 * @brief GET /api/forum/threads handler.
 */

#include "ForumController.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;
using namespace drogon;
using namespace drogon::orm;

namespace controllers
{

void ForumController::list(
    const HttpRequestPtr& req, Cb&& cb)
{
    const std::string pageStr =
        req->getParameter("page");
    int page = pageStr.empty()
        ? 1 : std::stoi(pageStr);
    if (page < 1) page = 1;
    const int limit = 20;
    const int offset = (page - 1) * limit;

    const std::string sql =
        "SELECT t.id, t.title, t.author_id, "
        "       t.created_at, "
        "  (SELECT COUNT(*) FROM comments_v2 p "
        "   WHERE p.target_type='forum_thread' "
        "   AND p.target_id = t.id::text "
        "   AND p.deleted_at IS NULL"
        "  ) AS reply_count "
        "FROM comments_v2 t "
        "WHERE t.target_type = 'forum_board' "
        "  AND t.deleted_at IS NULL "
        "ORDER BY t.created_at DESC "
        "LIMIT $1 OFFSET $2";

    auto db = app().getDbClient();
    *db << sql << limit << offset
        >> [cb, page](const Result& r) {
            json arr = json::array();
            for (const auto& row : r) {
                json t;
                t["id"] =
                    std::to_string(
                        row["id"]
                            .as<std::int64_t>());
                t["title"] =
                    row["title"].isNull()
                        ? "" : row["title"]
                                   .as<std::string>();
                t["author"] =
                    row["author_id"]
                        .as<std::string>();
                t["createdAt"] =
                    row["created_at"]
                        .as<std::string>();
                t["replyCount"] =
                    row["reply_count"]
                        .as<std::int64_t>();
                arr.push_back(t);
            }
            cb(::utils::jsonOk({
                {"data", arr},
                {"page", page},
                {"total",
                 static_cast<int>(arr.size())},
            }));
        }
        >> [cb](const DrogonDbException& e) {
            spdlog::error(
                "forum.list: {}",
                e.base().what());
            cb(::utils::jsonError(
                k500InternalServerError,
                "internal error"));
        };
}

} // namespace controllers
