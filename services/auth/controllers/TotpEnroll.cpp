/**
 * @file TotpEnroll.cpp
 * @brief POST /api/auth/totp/enroll
 *
 * Creates a fresh Base32 secret and 10 recovery codes, stores
 * them as (enabled=false) pending user verification via the
 * verify endpoint.
 */

#include "TotpController.h"
#include "auth/backend/totp/Base32.h"
#include "auth/backend/totp/RecoveryCodes.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <drogon/HttpAppFramework.h>
#include <drogon/orm/DbClient.h>
#include <nlohmann/json.hpp>
#include <openssl/rand.h>
#include <string>
#include <vector>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;
namespace totp = services::auth::totp;

namespace controllers
{

void TotpController::enroll(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto uid = req->attributes()
                   ->get<std::string>("user_id");
    std::vector<std::uint8_t> raw(20);
    RAND_bytes(raw.data(), raw.size());
    auto secret = totp::base32Encode(raw);
    auto codes = totp::generateRecoveryCodes(10, 8);
    std::vector<std::string> hashes;
    hashes.reserve(codes.size());
    for (const auto& c : codes)
        hashes.push_back(totp::hashRecoveryCode(c));

    auto db = drogon::app().getDbClient();
    db->execSqlAsync(
        "INSERT INTO user_totp "
        "(user_id,secret_b32,enabled,recovery_codes)"
        " VALUES ($1,$2,false,$3)"
        " ON CONFLICT (user_id) DO UPDATE SET"
        " secret_b32=$2, enabled=false, recovery_codes=$3",
        [cb, secret, codes](const drogon::orm::Result&) {
            auto uri =
                std::string(
                    "otpauth://totp/NextExtra?secret=") +
                secret + "&issuer=NextExtra";
            cb(::utils::jsonOk(json{
                {"secret", secret},
                {"otpauthUri", uri},
                {"recoveryCodes", codes}}));
        },
        [cb](const drogon::orm::DrogonDbException&) {
            cb(::utils::jsonError(
                drogon::k500InternalServerError,
                "db", "TOTP_001"));
        },
        uid, secret, hashes);
}

} // namespace controllers
