/**
 * @file ForumControllerList.cpp
 * @brief GET /api/forum/threads handler.
 *
 * Optional ?board=slug filter for drill-down pages.
 * Always returns total count so the frontend can
 * paginate on threads-of-a-board independently.
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

// Defined in ForumThreadRow.cpp.
json threadRowToJson(const Row& row);
std::string boardFilterClause(const std::string& b);
std::string threadListSql(const std::string& clause,
    int limit, int offset);
std::string threadCountSql(const std::string& clause);

void ForumController::list(
    const HttpRequestPtr& req, Cb&& cb)
{
    const std::string pageStr =
        req->getParameter("page");
    int page = pageStr.empty()
        ? 1 : std::stoi(pageStr);
    if (page < 1) page = 1;
    // Caller may request a smaller page (default 20,
    // capped at 100). Used by the forum index to fetch
    // top-N threads per board efficiently.
    int limit = 20;
    const auto lp = req->getParameter("limit");
    if (!lp.empty()) {
        limit = std::clamp(std::stoi(lp), 1, 100);
    }
    const int offset = (page - 1) * limit;
    const std::string clause = boardFilterClause(
        req->getParameter("board"));
    const std::string countSql = threadCountSql(clause);
    const std::string sql =
        threadListSql(clause, limit, offset);

    auto db = app().getDbClient();
    *db << countSql
        >> [cb, db, sql, page](const Result& cr) {
            const int total = cr.empty() ? 0
                : static_cast<int>(
                    cr[0]["n"].as<std::int64_t>());
            *db << sql
                >> [cb, page, total](const Result& r) {
                    json arr = json::array();
                    for (const auto& row : r) {
                        arr.push_back(
                            threadRowToJson(row));
                    }
                    cb(::utils::jsonOk({
                        {"data", arr},
                        {"page", page},
                        {"total", total}}));
                }
                >> [cb](const DrogonDbException& e) {
                    spdlog::error("forum.list: {}",
                        e.base().what());
                    cb(::utils::jsonError(
                        k500InternalServerError,
                        "internal error"));
                };
        }
        >> [cb](const DrogonDbException& e) {
            spdlog::error("forum.list count: {}",
                e.base().what());
            cb(::utils::jsonError(
                k500InternalServerError,
                "internal error"));
        };
}

} // namespace controllers
