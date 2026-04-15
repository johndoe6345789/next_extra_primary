/**
 * @file PasskeyRegisterFinish.cpp
 * @brief POST /api/auth/passkeys/register/finish
 *
 * Decodes the attestationObject, verifies it via the "none"
 * format verifier, and persists the new credential row.
 */

#include "PasskeyController.h"
#include "../services/auth/passkeys/AttestationVerifier.h"
#include "../services/auth/passkeys/Base64Url.h"
#include "../services/auth/passkeys/ChallengeStore.h"
#include "../utils/JsonResponse.h"

#include <drogon/HttpAppFramework.h>
#include <drogon/orm/DbClient.h>
#include <nlohmann/json.hpp>
#include <string>
#include <vector>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;
namespace pk = services::auth::passkeys;

namespace controllers
{

void PasskeyController::registerFinish(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto uid = req->attributes()
                   ->get<std::string>("user_id");
    auto body = json::parse(
        req->bodyData(),
        req->bodyData() + req->bodyLength(),
        nullptr, false);
    if (body.is_discarded() ||
        !body.contains("challenge") ||
        !body.contains("attestationObject")) {
        cb(::utils::jsonError(
            drogon::k400BadRequest, "missing", "PK_001"));
        return;
    }
    auto key = body["challenge"].get<std::string>();
    auto pcOpt =
        pk::ChallengeStore::instance().consume(key);
    if (!pcOpt || pcOpt->userId != uid) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "bad challenge", "PK_002"));
        return;
    }
    try {
        auto att = pk::b64urlDecode(
            body["attestationObject"].get<std::string>());
        std::vector<std::uint8_t> hash;
        auto res = pk::verifyAttestation(att, hash);
        auto db = drogon::app().getDbClient();
        db->execSqlAsync(
            "INSERT INTO passkey_credentials "
            "(user_id,credential_id,public_key,transports)"
            " VALUES ($1,$2,$3,$4)",
            [cb](const drogon::orm::Result&) {
                cb(::utils::jsonOk(json{{"ok", true}}));
            },
            [cb](const drogon::orm::DrogonDbException&) {
                cb(::utils::jsonError(
                    drogon::k500InternalServerError,
                    "db", "PK_003"));
            },
            uid, res.credentialId, res.publicKeyCose,
            std::vector<std::string>{});
    } catch (const std::exception& e) {
        cb(::utils::jsonError(
            drogon::k400BadRequest, e.what(), "PK_004"));
    }
}

} // namespace controllers
