/**
 * @file CommentsWrite.cpp
 * @brief Comment write endpoints: create, remove.
 */

#include "CommentsController.h"
#include "../services/comment_service.h"
#include "../utils/JsonResponse.h"
#include <nlohmann/json.hpp>

namespace controllers
{

using json = nlohmann::json;

void CommentsController::create(
    const drogon::HttpRequestPtr& req,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb)
{
    auto userId =
        req->attributes()->get<std::string>(
            "user_id");
    auto body = json::parse(
        req->bodyData(),
        req->bodyData() + req->bodyLength(),
        nullptr, false);

    if (!body.contains("content") ||
        !body["content"].is_string() ||
        body["content"]
            .get<std::string>().empty())
    {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "content is required"));
        return;
    }

    auto content =
        body["content"].get<std::string>();

    services::CommentService svc;
    svc.create(
        userId, content,
        [cb](const json& data) {
            cb(::utils::jsonCreated(data));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

void CommentsController::remove(
    const drogon::HttpRequestPtr& req,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb,
    const std::string& id)
{
    auto userId =
        req->attributes()->get<std::string>(
            "user_id");

    services::CommentService svc;
    svc.remove(
        id, userId,
        [cb](const json& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

} // namespace controllers
