/**
 * @file CommentsV2ModController.cpp
 * @brief Moderation endpoint implementations.
 */

#include "CommentsV2ModController.h"
#include "comments/backend/CommentStore.h"
#include "drogon-host/backend/utils/JsonResponse.h"

namespace controllers
{

using services::comments::CommentStore;
using services::comments::ModAction;

/** @brief Shared helper for single-id actions. */
static void runModAction(
    const std::string& id, ModAction act,
    std::function<void(
        const drogon::HttpResponsePtr&)> cb)
{
    CommentStore store;
    store.moderate(
        std::stoll(id), act,
        [cb](drogon::HttpStatusCode c,
             const std::string& m) {
            if (c == drogon::k200OK)
                cb(::utils::jsonOk(
                    {{"ok", true}}));
            else
                cb(::utils::jsonError(c, m));
        });
}

void CommentsV2ModController::flagged(
    const drogon::HttpRequestPtr& req,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb)
{
    auto limitStr =
        req->getParameter("limit");
    int limit = limitStr.empty()
                    ? 50
                    : std::stoi(limitStr);
    CommentStore store;
    store.listFlagged(
        limit, 0,
        [cb](auto rows) {
            nlohmann::json j = nlohmann::json::array();
            for (const auto& r : rows)
                j.push_back(r.toJson());
            cb(::utils::jsonOk(j));
        },
        [cb](drogon::HttpStatusCode c,
             const std::string& m) {
            cb(::utils::jsonError(c, m));
        });
}

void CommentsV2ModController::hide(
    const drogon::HttpRequestPtr&,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb,
    const std::string& id)
{
    runModAction(id, ModAction::Hide, cb);
}

void CommentsV2ModController::unhide(
    const drogon::HttpRequestPtr&,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb,
    const std::string& id)
{
    runModAction(id, ModAction::Unhide, cb);
}

void CommentsV2ModController::clearFlags(
    const drogon::HttpRequestPtr&,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb,
    const std::string& id)
{
    runModAction(
        id, ModAction::ClearFlags, cb);
}

} // namespace controllers
