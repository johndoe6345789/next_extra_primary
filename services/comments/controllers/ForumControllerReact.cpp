/** @brief POST /api/forum/posts/{id}/reactions. */
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

void ForumController::addReaction(
    const HttpRequestPtr& req, Cb&& cb,
    const std::string& id)
{
    json body;
    try {
        body = json::parse(
            std::string{req->getBody()});
    } catch (...) {
        cb(::utils::jsonError(
            k400BadRequest, "invalid JSON"));
        return;
    }
    if (!body.contains("type")) {
        cb(::utils::jsonError(
            k400BadRequest, "type required"));
        return;
    }
    const auto userId =
        req->getAttributes()->get<std::string>(
            "user_id");
    const auto kind =
        body["type"].get<std::string>();

    auto db = app().getDbClient();
    // INSERT … ON CONFLICT DO NOTHING acts as a
    // toggle-insert: duplicate reacts are silently
    // ignored rather than erroring.
    *db << "INSERT INTO comment_reactions "
           "  (comment_id, user_id, kind) "
           "VALUES ($1::bigint, $2, $3) "
           "ON CONFLICT DO NOTHING"
        << id << userId << kind
        >> [cb](const Result&) {
            cb(::utils::jsonOk({{"ok", true}}));
        }
        >> [cb](const DrogonDbException& e) {
            spdlog::error(
                "forum.addReaction: {}",
                e.base().what());
            cb(::utils::jsonError(
                k500InternalServerError,
                "internal error"));
        };
}

} // namespace controllers
