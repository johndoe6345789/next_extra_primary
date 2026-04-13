/**
 * @file ImpersonateController.cpp
 * @brief Impersonate a user (admin only).
 *
 * Looks up the target user, generates tokens, and
 * sets the nextra_sso HttpOnly cookie so the admin
 * can browse the portal as that user.
 */

#include "ImpersonateController.h"
#include "../services/sso_session_lookup.h"
#include "../utils/JwtUtil.h"
#include "../utils/JsonResponse.h"

#include <drogon/Cookie.h>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;

namespace controllers
{

void ImpersonateController::impersonate(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto role = req->getAttributes()
        ->get<std::string>("user_role");
    if (role != "admin") {
        cb(::utils::jsonError(
            drogon::k403Forbidden, "Admin only"));
        return;
    }

    auto body = json::parse(
        req->bodyData(),
        req->bodyData() + req->bodyLength(),
        nullptr, false);

    if (body.is_discarded()
        || !body.contains("userId")) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "userId is required"));
        return;
    }

    auto adminId = req->getAttributes()
        ->get<std::string>("user_id");
    auto targetId =
        body["userId"].get<std::string>();

    auto adminCookie =
        req->getCookie("nextra_sso");

    spdlog::info(
        "Admin {} impersonating user {}",
        adminId, targetId);

    services::ssoSessionLookup(
        targetId,
        [cb, targetId,
         adminCookie](const json& payload) {
            auto rt =
                ::utils::generateRefreshToken(
                    targetId);
            auto resp = ::utils::jsonOk(payload);
            drogon::Cookie sso("nextra_sso", rt);
            sso.setHttpOnly(true);
            sso.setPath("/");
            sso.setSameSite(
                drogon::Cookie::SameSite::kLax);
            sso.setMaxAge(30 * 24 * 3600);
            resp->addCookie(sso);
            drogon::Cookie backup(
                "nextra_sso_admin", adminCookie);
            backup.setHttpOnly(true);
            backup.setPath("/");
            backup.setSameSite(
                drogon::Cookie::SameSite::kLax);
            backup.setMaxAge(30 * 24 * 3600);
            resp->addCookie(backup);
            cb(resp);
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

} // namespace controllers
