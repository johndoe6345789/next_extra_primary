/**
 * @file PasskeyRegisterFinish.cpp
 * @brief POST /api/auth/passkeys/register/finish
 *
 * Decodes the attestationObject, verifies the attestation
 * statement, and persists the new credential row.
 */

#include "PasskeyController.h"
#include "auth/backend/passkeys/AttestationVerifier.h"
#include "auth/backend/passkeys/Base64Url.h"
#include "auth/backend/passkeys/ChallengeStore.h"
#include "auth/backend/passkeys/PasskeyHex.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <drogon/HttpAppFramework.h>
#include <drogon/orm/DbClient.h>
#include <nlohmann/json.hpp>
#include <openssl/sha.h>
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
        !body.contains("clientDataJSON") ||
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
        auto clientData = pk::b64urlDecode(
            body["clientDataJSON"].get<std::string>());
        auto att = pk::b64urlDecode(
            body["attestationObject"].get<std::string>());
        std::vector<std::uint8_t> hash(SHA256_DIGEST_LENGTH);
        SHA256(
            clientData.data(),
            clientData.size(),
            hash.data());
        auto res = pk::verifyAttestation(att, hash);
        auto db = drogon::app().getDbClient();
        db->execSqlAsync(
            "INSERT INTO passkey_credentials "
            "(user_id,credential_id,public_key,transports,aaguid)"
            " VALUES ("
            "$1,decode($2,'hex'),decode($3,'hex'),"
            "ARRAY[]::text[],decode($4,'hex'))",
            [cb](const drogon::orm::Result&) {
                cb(::utils::jsonOk(json{{"ok", true}}));
            },
            [cb](const drogon::orm::DrogonDbException&) {
                cb(::utils::jsonError(
                    drogon::k500InternalServerError,
                    "db", "PK_003"));
            },
            uid, pk::toHex(res.credentialId),
            pk::toHex(res.publicKeyCose),
            pk::toHex(res.aaguid));
    } catch (const std::exception& e) {
        cb(::utils::jsonError(
            drogon::k400BadRequest, e.what(), "PK_004"));
    }
}

} // namespace controllers
