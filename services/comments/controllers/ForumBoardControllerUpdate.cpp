/**
 * @file ForumBoardControllerUpdate.cpp
 * @brief PUT /api/forum/boards/{slug} handler.
 *
 * Admin-only. Uses COALESCE so only supplied
 * fields overwrite existing values.
 */
#include "ForumBoardController.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

#include <optional>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;
using namespace drogon;
using namespace drogon::orm;

namespace controllers
{

// Defined in ForumBoardRow.cpp
json boardRowToJson(const Row& row);

/** @brief Helper: optional string from JSON. */
static std::optional<std::string> optStr(
    const json& b, const std::string& k)
{
    if (b.contains(k) && b[k].is_string())
        return b[k].get<std::string>();
    return std::nullopt;
}

void ForumBoardController::update(
    const HttpRequestPtr& req, Cb&& cb,
    const std::string& slug)
{
    const auto role =
        req->getAttributes()->get<std::string>(
            "user_role");
    if (role != "admin") {
        cb(::utils::jsonError(
            k403Forbidden, "admin only"));
        return;
    }
    json body;
    try {
        body = json::parse(
            std::string{req->getBody()});
    } catch (...) {
        cb(::utils::jsonError(
            k400BadRequest, "invalid JSON"));
        return;
    }
    // Resolve optional string values; use
    // nullptr_t to pass SQL NULL via Drogon.
    const auto label = optStr(body, "label");
    const auto desc  =
        optStr(body, "description");
    const auto icon  = optStr(body, "icon");
    // Bool/int fields use string conversion
    // so they can be NULL-passed as strings.
    std::optional<std::string> reqAuth,
        guestVis, minP;
    if (body.contains("requiresAuth") &&
        body["requiresAuth"].is_boolean())
        reqAuth = body["requiresAuth"]
            .get<bool>() ? "true" : "false";
    if (body.contains("isGuestVisible") &&
        body["isGuestVisible"].is_boolean())
        guestVis = body["isGuestVisible"]
            .get<bool>() ? "true" : "false";
    if (body.contains("minPosts") &&
        body["minPosts"].is_number_integer())
        minP = std::to_string(
            body["minPosts"].get<int>());

    static const std::string kSql =
        "UPDATE forum_boards SET"
        "  label          = COALESCE($1, label),"
        "  description    = COALESCE($2, description),"
        "  icon           = COALESCE($3, icon),"
        "  requires_auth  ="
        "    COALESCE($4::bool, requires_auth),"
        "  is_guest_visible ="
        "    COALESCE($5::bool, is_guest_visible),"
        "  min_posts      ="
        "    COALESCE($6::int, min_posts),"
        "  updated_at     = NOW()"
        " WHERE slug=$7"
        " RETURNING slug, label, description,"
        "   icon, requires_auth, min_posts,"
        "   is_guest_visible, sort_order";
    auto db = app().getDbClient();
    auto binder = *db << kSql;
    if (label)   binder << *label;
    else         binder << nullptr;
    if (desc)    binder << *desc;
    else         binder << nullptr;
    if (icon)    binder << *icon;
    else         binder << nullptr;
    if (reqAuth) binder << *reqAuth;
    else         binder << nullptr;
    if (guestVis) binder << *guestVis;
    else          binder << nullptr;
    if (minP)    binder << *minP;
    else         binder << nullptr;
    std::move(binder) << slug
        >> [cb](const Result& r) {
            if (r.empty()) {
                cb(::utils::jsonError(
                    k404NotFound,
                    "board not found"));
                return;
            }
            cb(::utils::jsonOk(
                boardRowToJson(r[0])));
        }
        >> [cb](const DrogonDbException& e) {
            spdlog::error(
                "forum.boards.update: {}",
                e.base().what());
            cb(::utils::jsonError(
                k500InternalServerError,
                "internal error"));
        };
}

} // namespace controllers
