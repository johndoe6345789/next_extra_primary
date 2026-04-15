/**
 * @file CommentsController.cpp
 * @brief Comment list endpoint (public).
 */

#include "CommentsController.h"
#include "comments/backend/comment_service.h"
#include "drogon-host/backend/utils/JsonResponse.h"
#include <nlohmann/json.hpp>

namespace controllers
{

using json = nlohmann::json;

void CommentsController::list(
    const drogon::HttpRequestPtr& req,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb)
{
    auto limitStr =
        req->getParameter("limit");
    auto offsetStr =
        req->getParameter("offset");
    int limit = limitStr.empty()
                    ? 50
                    : std::stoi(limitStr);
    int offset = offsetStr.empty()
                     ? 0
                     : std::stoi(offsetStr);

    services::CommentService svc;
    svc.list(
        limit, offset,
        [cb](const json& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

} // namespace controllers
