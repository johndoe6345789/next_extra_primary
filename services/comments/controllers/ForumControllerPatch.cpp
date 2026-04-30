/**
 * @file ForumControllerPatch.cpp
 * @brief PATCH /api/forum/posts/{id} handler.
 *
 * Only the original author may edit their own post.
 * A missing or deleted post returns 403 (no info leak).
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

void ForumController::update(
    const HttpRequestPtr& req, Cb&& cb,
    const std::string& id)
{
    const auto userId =
        req->getAttributes()->get<std::string>(
            "user_id");
    json body;
    try {
        body = json::parse(
            std::string{req->getBody()});
    } catch (...) {
        cb(::utils::jsonError(
            k400BadRequest, "invalid JSON"));
        return;
    }
    if (!body.contains("body") ||
        !body["body"].is_string()) {
        cb(::utils::jsonError(
            k400BadRequest, "body required"));
        return;
    }
    const auto bodyText =
        body["body"].get<std::string>();
    auto db = app().getDbClient();
    *db << "UPDATE comments_v2"
           "  SET body=$1, updated_at=NOW()"
           " WHERE id=$2"
           "   AND author_id=$3"
           "   AND target_type='forum_thread'"
           "   AND deleted_at IS NULL"
           " RETURNING id, body, updated_at"
        << bodyText << id << userId
        >> [cb](const Result& r) {
            if (r.empty()) {
                cb(::utils::jsonError(
                    k403Forbidden,
                    "not found or forbidden"));
                return;
            }
            const auto& row = r[0];
            cb(::utils::jsonOk({
                {"id", std::to_string(
                    row["id"]
                        .as<std::int64_t>())},
                {"body",
                    row["body"]
                        .as<std::string>()},
                {"updatedAt",
                    row["updated_at"]
                        .as<std::string>()},
            }));
        }
        >> [cb](const DrogonDbException& e) {
            spdlog::error("forum.post.patch: {}",
                e.base().what());
            cb(::utils::jsonError(
                k500InternalServerError,
                "internal error"));
        };
}

} // namespace controllers
