/**
 * @file MentionsControllerList.cpp
 * @brief GET /api/social/mentions handler.
 */

#include "MentionsController.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;
using namespace drogon;
using namespace drogon::orm;

namespace controllers::social
{

void MentionsController::list(
    const HttpRequestPtr& req, Cb&& cb)
{
    const auto userId =
        req->getAttributes()->get<std::string>(
            "user_id");
    if (userId.empty()) {
        cb(::utils::jsonError(
            k401Unauthorized, "unauthorized"));
        return;
    }

    const std::string pageStr =
        req->getParameter("page");
    int page = pageStr.empty()
        ? 1 : std::stoi(pageStr);
    if (page < 1) page = 1;
    const int limit = 20;
    const int offset = (page - 1) * limit;

    auto db = drogon::app().getDbClient();
    // Schema: mentions(id, source_type, source_id,
    // mentioned_user_id, created_at). No read_at column —
    // mentions are an ephemeral stream surfaced via the
    // notifications service for unread tracking.
    //
    // limit/offset are string-interpolated (trusted ints)
    // because Drogon's PgBatchConnection has a bug with
    // multi-int params that surfaces here as
    // "insufficient data left in message".
    const std::string sql =
        "SELECT id, source_type, source_id, "
        "  mentioned_user_id, created_at "
        "FROM mentions "
        "WHERE mentioned_user_id = $1 "
        "ORDER BY created_at DESC "
        "LIMIT " + std::to_string(limit)
        + " OFFSET " + std::to_string(offset);

    *db << sql << userId
        >> [cb](const Result& r) {
            nlohmann::json arr =
                nlohmann::json::array();
            for (const auto& row : r) {
                nlohmann::json m;
                m["id"] =
                    row["id"].as<std::string>();
                m["sourceType"] =
                    row["source_type"]
                        .as<std::string>();
                m["sourceId"] =
                    row["source_id"]
                        .as<std::string>();
                m["mentionedUserId"] =
                    row["mentioned_user_id"]
                        .as<std::string>();
                m["createdAt"] =
                    row["created_at"]
                        .as<std::string>();
                arr.push_back(m);
            }
            cb(::utils::jsonOk(
                {{"data", arr}}));
        }
        >> [cb](const DrogonDbException& e) {
            spdlog::error(
                "mentions.list: {}",
                e.base().what());
            cb(::utils::jsonError(
                k500InternalServerError,
                "internal error"));
        };
}

} // namespace controllers::social
