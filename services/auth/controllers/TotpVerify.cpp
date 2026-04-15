/**
 * @file TotpVerify.cpp
 * @brief POST /api/auth/totp/verify
 *
 * Validates a 6-digit TOTP code for the authenticated user
 * and marks their enrolment enabled on success.
 */

#include "TotpController.h"
#include "auth/backend/totp/Base32.h"
#include "auth/backend/totp/Totp.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <drogon/HttpAppFramework.h>
#include <drogon/orm/DbClient.h>
#include <nlohmann/json.hpp>
#include <string>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;
namespace totp = services::auth::totp;

namespace controllers
{

void TotpController::verify(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto uid = req->attributes()
                   ->get<std::string>("user_id");
    auto body = json::parse(
        req->bodyData(),
        req->bodyData() + req->bodyLength(),
        nullptr, false);
    if (body.is_discarded() || !body.contains("code")) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "code required", "TOTP_002"));
        return;
    }
    auto code = body["code"].get<std::string>();

    auto db = drogon::app().getDbClient();
    db->execSqlAsync(
        "SELECT secret_b32 FROM user_totp"
        " WHERE user_id = $1",
        [cb, uid, code](const drogon::orm::Result& r) {
            if (r.empty()) {
                cb(::utils::jsonError(
                    drogon::k404NotFound,
                    "not enrolled", "TOTP_003"));
                return;
            }
            auto sec =
                r[0]["secret_b32"].as<std::string>();
            auto key = totp::base32Decode(sec);
            if (!totp::totpVerify(key, code)) {
                cb(::utils::jsonError(
                    drogon::k401Unauthorized,
                    "bad code", "TOTP_004"));
                return;
            }
            auto db2 = drogon::app().getDbClient();
            db2->execSqlAsync(
                "UPDATE user_totp SET enabled=true,"
                " enrolled_at=now() WHERE user_id=$1",
                [cb](const drogon::orm::Result&) {
                    cb(::utils::jsonOk(
                        json{{"ok", true}}));
                },
                [cb](const drogon::orm::DrogonDbException&) {
                    cb(::utils::jsonError(
                        drogon::k500InternalServerError,
                        "db", "TOTP_005"));
                },
                uid);
        },
        [cb](const drogon::orm::DrogonDbException&) {
            cb(::utils::jsonError(
                drogon::k500InternalServerError,
                "db", "TOTP_006"));
        },
        uid);
}

} // namespace controllers
