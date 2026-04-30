/** @brief Helper functions for ForumController::detail. */

#include "drogon-host/backend/utils/JsonResponse.h"
#include <drogon/drogon.h>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

using json = nlohmann::json;
using Cb   = std::function<void(
    const drogon::HttpResponsePtr&)>;
using namespace drogon;
using namespace drogon::orm;

namespace controllers
{

// From ForumThreadRow.cpp:
json postRowToJson(const Row& p,
    const std::string& threadId);
std::string postListSql(int limit, int offset);
std::string postCountSql();

/** Build the thread JSON object from a DB row. */
json buildThreadJson(const Row& row,
    const std::string& tid)
{
    auto str = [&](const char* c,
                   const char* def = "") {
        return row[c].isNull()
            ? std::string{def}
            : row[c].as<std::string>();
    };
    return {{"id", tid}, {"title", str("title")},
        {"board",           str("board", "general")},
        {"author",          str("author_id")},
        {"authorName",      str("author_name")},
        {"authorPostCount",
            row["author_post_count"].as<std::int64_t>()},
        {"body",            str("body")},
        {"createdAt",       str("created_at")}};
}

/** Log a DB error and send a 500 response. */
void onErr(const Cb& cb, const char* op,
    const DrogonDbException& e)
{
    spdlog::error("forum.detail.{}: {}",
        op, e.base().what());
    cb(::utils::jsonError(
        k500InternalServerError, "internal error"));
}

/** Count posts then fetch the requested page.
 *  Page 1 fetches ppp-1 replies (one slot reserved
 *  for the opening post rendered client-side). */
void fetchThreadPosts(
    const std::shared_ptr<DbClient>& db,
    const Cb& cb, const json& th,
    const std::string& tid, int page, int ppp)
{
    *db << postCountSql() << tid
        >> [cb, db, th, tid, page, ppp](
                const Result& cr) {
            const int total = cr.empty() ? 0
              : static_cast<int>(
                  cr[0]["n"].as<std::int64_t>());
            const int lim = (page == 1)
                ? ppp - 1 : ppp;
            const int off = (page == 1)
                ? 0 : ppp - 1 + (page - 2) * ppp;
            *db << postListSql(lim, off) << tid
                >> [cb, th, tid, page, total](
                        const Result& pr) {
                    json posts = json::array();
                    for (const auto& p : pr)
                        posts.push_back(
                            postRowToJson(p, tid));
                    cb(::utils::jsonOk({
                        {"thread",    th},
                        {"posts",     posts},
                        {"postPage",  page},
                        {"postTotal", total}}));
                }
                >> [cb](const DrogonDbException& e) {
                    onErr(cb, "posts", e);
                };
        }
        >> [cb](const DrogonDbException& e) {
            onErr(cb, "count", e);
        };
}

} // namespace controllers
