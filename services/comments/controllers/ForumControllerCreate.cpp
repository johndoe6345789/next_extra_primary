/** @brief POST /api/forum/threads handler. */
#include "ForumController.h"
#include "drogon-host/backend/utils/JsonResponse.h"
#include "search/events/SearchEventPublisher.h"
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

void ForumController::create(
    const HttpRequestPtr& req, Cb&& cb)
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
    if (!body.contains("title") ||
        !body.contains("body")) {
        cb(::utils::jsonError(
            k400BadRequest,
            "title and body required"));
        return;
    }
    const auto userId =
        req->getAttributes()->get<std::string>(
            "user_id");
    const auto title =
        body["title"].get<std::string>();
    const auto bodyText =
        body["body"].get<std::string>();
    const auto board = body.value(
        "board", std::string{"general"});

    auto db = app().getDbClient();
    *db << "INSERT INTO comments_v2 "
           "  (target_type, target_id, author_id,"
           "   body, title, depth) "
           "VALUES ('forum_board', "
           "        $4, $1, $2, $3, 0) "
           "RETURNING id, title, author_id, "
           "          created_at"
        << userId << bodyText << title << board
        >> [cb, title, bodyText, userId](
                const Result& r) {
            const auto& row = r[0];
            const auto idStr = std::to_string(
                row["id"].as<std::int64_t>());
            const auto createdAt =
                row["created_at"].as<std::string>();
            json doc;
            doc["target_type"] = "forum_board";
            doc["author_id"] = userId;
            doc["title"] = title;
            doc["body"] = bodyText;
            doc["created_at"] = createdAt;
            nextra::search::SearchEventPublisher
                ::publish("upsert", "forum_posts",
                          idStr, doc);
            cb(::utils::jsonOk({
                {"id", idStr},
                {"title", title},
                {"author", userId},
                {"createdAt", createdAt},
                {"replyCount", 0},
            }));
        }
        >> [cb](const DrogonDbException& e) {
            spdlog::error("forum.create: {}",
                e.base().what());
            cb(::utils::jsonError(
                k500InternalServerError,
                "internal error"));
        };
}

} // namespace controllers
