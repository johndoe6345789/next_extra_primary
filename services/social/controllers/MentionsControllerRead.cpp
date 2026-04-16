/**
 * @file MentionsControllerRead.cpp
 * @brief PATCH /api/social/mentions/:id/read handler.
 */

#include "MentionsController.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <drogon/drogon.h>
#include <spdlog/spdlog.h>

using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;
using namespace drogon;
using namespace drogon::orm;

namespace controllers::social
{

void MentionsController::markRead(
    const HttpRequestPtr& req, Cb&& cb,
    const std::string& id)
{
    const auto userId =
        req->getAttributes()->get<std::string>(
            "user_id");
    if (userId.empty()) {
        cb(::utils::jsonError(
            k401Unauthorized, "unauthorized"));
        return;
    }

    auto db = drogon::app().getDbClient();
    const std::string sql =
        "UPDATE mentions "
        "SET read_at = NOW() "
        "WHERE id = $1 AND user_id = $2 "
        "RETURNING id";

    *db << sql << id << userId
        >> [cb](const Result& r) {
            if (r.empty()) {
                cb(::utils::jsonError(
                    k404NotFound,
                    "mention not found"));
                return;
            }
            cb(::utils::jsonOk({{"ok", true}}));
        }
        >> [cb](const DrogonDbException& e) {
            spdlog::error(
                "mentions.markRead: {}",
                e.base().what());
            cb(::utils::jsonError(
                k500InternalServerError,
                "internal error"));
        };
}

} // namespace controllers::social
