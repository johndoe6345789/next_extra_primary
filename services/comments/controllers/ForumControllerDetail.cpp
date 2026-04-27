/** @brief GET /api/forum/threads/{id} handler. */
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

static json postRow(const Row& p,
    const std::string& tid)
{
    auto optId = [&](const char* c) -> json {
        return p[c].isNull() ? json(nullptr)
            : json(std::to_string(
                p[c].as<std::int64_t>()));
    };
    return {{"id", optId("id")},
        {"threadId", tid},
        {"parentId", optId("parent_id")},
        {"author",
            p["author_id"].as<std::string>()},
        {"body", p["body"].as<std::string>()},
        {"depth", p["depth"].as<int>()},
        {"createdAt",
            p["created_at"].as<std::string>()}};
}

void ForumController::detail(
    const HttpRequestPtr& req, Cb&& cb,
    const std::string& id)
{
    auto db = app().getDbClient();
    *db << "SELECT id, title, author_id, "
           "created_at FROM comments_v2 "
           "WHERE id=$1 "
           "AND target_type='forum_board' "
           "AND deleted_at IS NULL" << id
        >> [cb, id, db](const Result& r) {
            if (r.empty()) {
                cb(::utils::jsonError(
                    k404NotFound,
                    "thread not found"));
                return;
            }
            const auto& row = r[0];
            const std::string tid =
                std::to_string(
                    row["id"].as<std::int64_t>());
            json th = {{"id", tid},
                {"title",
                    row["title"].isNull() ? ""
                    : row["title"]
                          .as<std::string>()},
                {"author",
                    row["author_id"]
                        .as<std::string>()},
                {"createdAt",
                    row["created_at"]
                        .as<std::string>()}};
            *db << "SELECT id, parent_id, "
                   "author_id, body, depth, "
                   "created_at FROM comments_v2 "
                   "WHERE target_type="
                   "'forum_thread' "
                   "AND target_id=$1 "
                   "AND deleted_at IS NULL "
                   "ORDER BY path ASC" << id
                >> [cb, th, tid](const Result& pr) {
                    json posts = json::array();
                    for (const auto& p : pr)
                        posts.push_back(
                            postRow(p, tid));
                    cb(::utils::jsonOk({
                        {"thread", th},
                        {"posts", posts}}));
                }
                >> [cb](
                    const DrogonDbException& e) {
                    spdlog::error(
                        "forum.detail.posts: {}",
                        e.base().what());
                    cb(::utils::jsonError(
                        k500InternalServerError,
                        "internal error"));
                };
        }
        >> [cb](const DrogonDbException& e) {
            spdlog::error("forum.detail: {}",
                e.base().what());
            cb(::utils::jsonError(
                k500InternalServerError,
                "internal error"));
        };
}

} // namespace controllers
