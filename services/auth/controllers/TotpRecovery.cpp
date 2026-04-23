/**
 * @file TotpRecovery.cpp
 * @brief POST /api/auth/totp/recovery
 *
 * Exchanges a one-time recovery code for an authenticated
 * session, removing the consumed hash.  Public endpoint —
 * the caller must also supply userId from prior login step.
 */

#include "TotpController.h"
#include "auth/backend/totp/RecoveryCodes.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <drogon/HttpAppFramework.h>
#include <drogon/orm/DbClient.h>
#include <nlohmann/json.hpp>
#include <string>
#include <vector>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;
namespace totp = services::auth::totp;

namespace
{
// Parse PostgreSQL text[] literal "{a,b,c}" into vector.
// Codes are alphanumeric — no quoting/escaping needed.
std::vector<std::string> parsePgArray(
    const std::string& raw)
{
    std::vector<std::string> out;
    if (raw.size() < 2) return out;
    std::string inner = raw.substr(1, raw.size() - 2);
    std::string cur;
    for (char c : inner) {
        if (c == ',') {
            if (!cur.empty()) out.push_back(cur);
            cur.clear();
        } else {
            cur.push_back(c);
        }
    }
    if (!cur.empty()) out.push_back(cur);
    return out;
}
std::string encodePgArray(
    const std::vector<std::string>& v)
{
    std::string out = "{";
    for (size_t i = 0; i < v.size(); ++i) {
        if (i) out += ',';
        out += v[i];
    }
    out += '}';
    return out;
}
}

namespace controllers
{

void TotpController::recovery(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto body = json::parse(
        req->bodyData(),
        req->bodyData() + req->bodyLength(),
        nullptr, false);
    if (body.is_discarded() ||
        !body.contains("userId") ||
        !body.contains("code")) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "missing", "TOTP_007"));
        return;
    }
    auto uid = body["userId"].get<std::string>();
    auto code = body["code"].get<std::string>();

    auto db = drogon::app().getDbClient();
    db->execSqlAsync(
        "SELECT recovery_codes FROM user_totp"
        " WHERE user_id=$1 AND enabled=true",
        [cb, uid, code](const drogon::orm::Result& r) {
            if (r.empty()) {
                cb(::utils::jsonError(
                    drogon::k404NotFound,
                    "none", "TOTP_008"));
                return;
            }
            auto arr = parsePgArray(
                r[0]["recovery_codes"]
                    .as<std::string>());
            int idx = totp::findMatchingRecoveryCode(
                code, arr);
            if (idx < 0) {
                cb(::utils::jsonError(
                    drogon::k401Unauthorized,
                    "no match", "TOTP_009"));
                return;
            }
            arr.erase(arr.begin() + idx);
            auto db2 = drogon::app().getDbClient();
            db2->execSqlAsync(
                "UPDATE user_totp SET recovery_codes=$1"
                " WHERE user_id=$2",
                [cb](const drogon::orm::Result&) {
                    cb(::utils::jsonOk(
                        json{{"ok", true}}));
                },
                [cb](const drogon::orm::DrogonDbException&) {
                    cb(::utils::jsonError(
                        drogon::k500InternalServerError,
                        "db", "TOTP_010"));
                },
                encodePgArray(arr), uid);
        },
        [cb](const drogon::orm::DrogonDbException&) {
            cb(::utils::jsonError(
                drogon::k500InternalServerError,
                "db", "TOTP_011"));
        },
        uid);
}

} // namespace controllers
