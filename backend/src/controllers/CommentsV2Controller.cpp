/**
 * @file CommentsV2Controller.cpp
 * @brief Public CRUD endpoints for threaded
 *        comments. Moderation lives elsewhere.
 */

#include "CommentsV2Controller.h"
#include "../services/comments/CommentStore.h"
#include "../services/comments/CommentTree.h"
#include "../utils/JsonResponse.h"

namespace controllers
{

using services::comments::CommentStore;
using services::comments::CommentTree;
using services::comments::CreateCommentInput;

void CommentsV2Controller::tree(
    const drogon::HttpRequestPtr& req,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb)
{
    auto targetType =
        req->getParameter("target_type");
    auto targetId =
        req->getParameter("target_id");
    if (targetType.empty() ||
        targetId.empty()) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "target_type + target_id required"));
        return;
    }
    CommentStore store;
    store.listForTarget(
        targetType, targetId, 500, 0,
        [cb](auto rows) {
            cb(::utils::jsonOk(
                CommentTree::build(rows)));
        },
        [cb](drogon::HttpStatusCode c,
             const std::string& m) {
            cb(::utils::jsonError(c, m));
        });
}

void CommentsV2Controller::flag(
    const drogon::HttpRequestPtr& req,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb,
    const std::string& id)
{
    auto body = req->getJsonObject();
    std::string reason =
        body && body->isMember("reason")
            ? (*body)["reason"].asString()
            : "unspecified";
    std::string reporter =
        req->getAttributes()->get<std::string>(
            "userId");
    CommentStore store;
    store.flag(
        std::stoll(id), reporter, reason,
        [cb](drogon::HttpStatusCode c,
             const std::string& m) {
            if (c == drogon::k200OK)
                cb(::utils::jsonOk({{"ok", true}}));
            else
                cb(::utils::jsonError(c, m));
        });
}

} // namespace controllers
