/** @brief POST /api/forum/threads handler. */
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

    auto db = app().getDbClient();
    *db << "INSERT INTO comments_v2 "
           "  (target_type, target_id, author_id,"
           "   body, title, depth) "
           "VALUES ('forum_board', 'main', "
           "        $1, $2, $3, 0) "
           "RETURNING id, title, author_id, "
           "          created_at"
        << userId << bodyText << title
        >> [cb](const Result& r) {
            const auto& row = r[0];
            cb(::utils::jsonOk({
                {"id", std::to_string(
                    row["id"]
                        .as<std::int64_t>())},
                {"title",
                    row["title"]
                        .as<std::string>()},
                {"author",
                    row["author_id"]
                        .as<std::string>()},
                {"createdAt",
                    row["created_at"]
                        .as<std::string>()},
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
