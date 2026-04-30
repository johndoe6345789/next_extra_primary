/** @brief GET /api/forum/threads/{id}.
 *
 *  Returns the thread row plus a paginated page of
 *  its posts. Query params: postPage=N (default 1),
 *  limit=N (default 5, range 3–50). */

#include "ForumController.h"
#include "drogon-host/backend/utils/JsonResponse.h"
#include <drogon/drogon.h>
#include <nlohmann/json.hpp>

using json = nlohmann::json;
using Cb   = std::function<void(
    const drogon::HttpResponsePtr&)>;
using namespace drogon;
using namespace drogon::orm;

namespace controllers
{

constexpr int kDefaultLimit = 5;
constexpr int kMinLimit     = 3;
constexpr int kMaxLimit     = 50;

// From ForumControllerDetailImpl.cpp:
json buildThreadJson(const Row& row,
    const std::string& tid);
void onErr(const Cb& cb, const char* op,
    const DrogonDbException& e);
void fetchThreadPosts(
    const std::shared_ptr<DbClient>& db,
    const Cb& cb, const json& th,
    const std::string& tid, int page, int ppp);

void ForumController::detail(
    const HttpRequestPtr& req, Cb&& cb,
    const std::string& id)
{
    int page = 1;
    const auto pp = req->getParameter("postPage");
    if (!pp.empty()) page = std::max(1, std::stoi(pp));

    int ppp = kDefaultLimit;
    const auto lp = req->getParameter("limit");
    if (!lp.empty())
        ppp = std::clamp(
            std::stoi(lp), kMinLimit, kMaxLimit);

    auto db = app().getDbClient();
    *db << "SELECT t.id, t.title, t.author_id,"
           " t.target_id AS board, t.body,"
           " t.created_at,"
           " u.display_name AS author_name,"
           " (SELECT COUNT(*) FROM comments_v2"
           "  WHERE author_id=t.author_id"
           "  AND deleted_at IS NULL)"
           "  AS author_post_count"
           " FROM comments_v2 t"
           " LEFT JOIN users u ON u.id=t.author_id"
           " WHERE t.id=$1"
           " AND t.target_type='forum_board'"
           " AND t.deleted_at IS NULL" << id
        >> [cb, id, db, page, ppp](const Result& r) {
            if (r.empty()) {
                cb(::utils::jsonError(
                    k404NotFound, "thread not found"));
                return;
            }
            const std::string tid = std::to_string(
                r[0]["id"].as<std::int64_t>());
            fetchThreadPosts(db, cb,
                buildThreadJson(r[0], tid),
                tid, page, ppp);
        }
        >> [cb](const DrogonDbException& e) {
            onErr(cb, "thread", e);
        };
}

} // namespace controllers
