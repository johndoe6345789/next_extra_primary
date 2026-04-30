/** @brief GET /api/forum/threads/{id}.
 *
 *  Returns the thread row plus a paginated slice of
 *  its posts. Uses ?postPage=N (default 1) so threads
 *  with thousands of replies stream in chunks of 25. */

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

constexpr int kPostsPerPage = 25;

// In ForumThreadRow.cpp:
json postRowToJson(const Row& p,
    const std::string& threadId);
std::string postListSql(int limit, int offset);
std::string postCountSql();

namespace {

json buildThreadJson(const Row& row,
    const std::string& tid)
{
    auto str = [&](const char* c, const char* def = "") {
        return row[c].isNull() ? std::string{def}
            : row[c].as<std::string>();
    };
    return {{"id", tid}, {"title", str("title")},
        {"board", str("board", "general")},
        {"author", str("author_id")},
        {"authorName", str("author_name")},
        {"body", str("body")},
        {"createdAt", str("created_at")}};
}

void onErr(const Cb& cb, const char* op,
    const DrogonDbException& e)
{
    spdlog::error("forum.detail.{}: {}",
        op, e.base().what());
    cb(::utils::jsonError(
        k500InternalServerError, "internal error"));
}

void fetchPosts(const std::shared_ptr<DbClient>& db,
    const Cb& cb, const json& th, const std::string& id,
    int page, int total)
{
    const int offset = (page - 1) * kPostsPerPage;
    *db << postListSql(kPostsPerPage, offset) << id
        >> [cb, th, id, page, total](const Result& pr) {
            json posts = json::array();
            for (const auto& p : pr) {
                posts.push_back(postRowToJson(p, id));
            }
            cb(::utils::jsonOk({{"thread", th},
                {"posts", posts},
                {"postPage", page},
                {"postTotal", total}}));
        }
        >> [cb](const DrogonDbException& e) {
            onErr(cb, "posts", e);
        };
}

} // namespace

void ForumController::detail(
    const HttpRequestPtr& req, Cb&& cb,
    const std::string& id)
{
    int page = 1;
    const auto pp = req->getParameter("postPage");
    if (!pp.empty()) page = std::max(1, std::stoi(pp));
    auto db = app().getDbClient();

    *db << "SELECT t.id, t.title, t.author_id, "
           "t.target_id AS board, t.body, "
           "t.created_at, "
           "u.display_name AS author_name "
           "FROM comments_v2 t "
           "LEFT JOIN users u ON u.id=t.author_id "
           "WHERE t.id=$1 "
           "AND t.target_type='forum_board' "
           "AND t.deleted_at IS NULL" << id
        >> [cb, id, db, page](const Result& r) {
            if (r.empty()) {
                cb(::utils::jsonError(
                    k404NotFound, "thread not found"));
                return;
            }
            const std::string tid =
                std::to_string(
                    r[0]["id"].as<std::int64_t>());
            const json th = buildThreadJson(r[0], tid);
            *db << postCountSql() << id
                >> [cb, db, th, tid, page](
                        const Result& cr) {
                    const int total = cr.empty() ? 0
                      : static_cast<int>(
                        cr[0]["n"].as<std::int64_t>());
                    fetchPosts(db, cb, th, tid,
                        page, total);
                }
                >> [cb](const DrogonDbException& e) {
                    onErr(cb, "count", e);
                };
        }
        >> [cb](const DrogonDbException& e) {
            onErr(cb, "thread", e);
        };
}

} // namespace controllers
