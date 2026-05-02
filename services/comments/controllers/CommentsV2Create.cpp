/**
 * @file CommentsV2Create.cpp
 * @brief Handles POST /api/comments/v2
 *        (body-validated create endpoint).
 */

#include "CommentsV2Controller.h"
#include "comments/backend/CommentStore.h"
#include "drogon-host/backend/utils/JsonResponse.h"
#include "search/backend/SearchEventPublisher.h"

#include <nlohmann/json.hpp>

namespace controllers
{

using services::comments::CommentStore;
using services::comments::CreateCommentInput;

void CommentsV2Controller::create(
    const drogon::HttpRequestPtr& req,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb)
{
    auto body = req->getJsonObject();
    if (!body) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "JSON body required"));
        return;
    }
    CreateCommentInput in;
    in.targetType =
        (*body)["target_type"].asString();
    in.targetId =
        (*body)["target_id"].asString();
    in.body = (*body)["body"].asString();
    if (body->isMember("parent_id") &&
        !(*body)["parent_id"].isNull())
        in.parentId =
            (*body)["parent_id"].asInt64();
    in.authorId =
        req->getAttributes()->get<std::string>(
            "userId");
    if (in.targetType.empty() ||
        in.targetId.empty() ||
        in.body.empty()) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "required fields missing"));
        return;
    }
    CommentStore store;
    store.insert(
        in,
        [cb](auto row) {
            nlohmann::json doc;
            doc["target_type"] = row.targetType;
            doc["target_id"] = row.targetId;
            doc["author_id"] = row.authorId;
            doc["body"] = row.body;
            doc["created_at"] = row.createdAt;
            nextra::search::SearchEventPublisher
                ::publish(
                    "upsert", "forum_posts",
                    std::to_string(row.id), doc);
            cb(::utils::jsonOk(row.toJson()));
        },
        [cb](drogon::HttpStatusCode c,
             const std::string& m) {
            cb(::utils::jsonError(c, m));
        });
}

} // namespace controllers
