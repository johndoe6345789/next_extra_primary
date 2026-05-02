/** @brief POST /api/forum/threads/{id}/posts. */
#include "ForumController.h"
#include "comments/backend/CommentStore.h"
#include "drogon-host/backend/utils/JsonResponse.h"
#include "search/backend/SearchEventPublisher.h"
#include <drogon/drogon.h>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;
using namespace drogon;
using namespace services::comments;

namespace controllers
{

void ForumController::createPost(
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
    if (!body.contains("body")) {
        cb(::utils::jsonError(
            k400BadRequest, "body required"));
        return;
    }
    const auto userId =
        req->getAttributes()->get<std::string>(
            "user_id");
    const auto parentIdStr =
        body.value("parentId", std::string{});

    CreateCommentInput in;
    in.targetType = "forum_thread";
    in.targetId   = id;
    in.authorId   = userId;
    in.body = body["body"].get<std::string>();
    if (!parentIdStr.empty()) {
        try {
            in.parentId =
                std::stoll(parentIdStr);
        } catch (...) {}
    }

    CommentStore store;
    store.insert(
        in,
        [cb, id](CommentRow row) {
            nextra::search::SearchEventPublisher
                ::publish("upsert", "forum_posts",
                    std::to_string(row.id),
                    {{"target_type", row.targetType},
                     {"target_id", row.targetId},
                     {"author_id", row.authorId},
                     {"body", row.body},
                     {"created_at", row.createdAt}});
            cb(::utils::jsonOk({
                {"id", std::to_string(row.id)},
                {"threadId", id},
                {"parentId",
                    row.parentId.has_value()
                        ? json(std::to_string(
                            *row.parentId))
                        : json(nullptr)},
                {"author", row.authorId},
                {"body", row.body},
                {"depth", row.depth},
                {"createdAt", row.createdAt},
            }));
        },
        [cb](HttpStatusCode c,
             const std::string& m) {
            spdlog::error(
                "forum.createPost: {}", m);
            cb(::utils::jsonError(c, m));
        });
}

} // namespace controllers
