/**
 * @file PasskeyAssertFinish.cpp
 * @brief POST /api/auth/passkeys/assert/finish — verify
 *        assertion signature and mint a session.
 */

#include "PasskeyController.h"
#include "passkey_assert_helpers.h"
#include "auth/backend/passkeys/AssertionVerifier.h"
#include "auth/backend/passkeys/Base64Url.h"
#include "auth/backend/passkeys/ChallengeStore.h"
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

void PasskeyController::assertFinish(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto body = json::parse(
        req->bodyData(),
        req->bodyData() + req->bodyLength(),
        nullptr, false);
    if (body.is_discarded() ||
        !body.contains("challenge") ||
        !body.contains("credentialId") ||
        !body.contains("authenticatorData") ||
        !body.contains("clientDataJSON") ||
        !body.contains("signature")) {
        cb(::utils::jsonError(
            drogon::k400BadRequest, "missing", "PK_005"));
        return;
    }
    auto key = body["challenge"].get<std::string>();
    if (!pk::ChallengeStore::instance().consume(key)) {
        cb(::utils::jsonError(
            drogon::k400BadRequest, "bad", "PK_006"));
        return;
    }
    auto credId = pk::b64urlDecode(
        body["credentialId"].get<std::string>());
    auto authData = pk::b64urlDecode(
        body["authenticatorData"].get<std::string>());
    auto cj = pk::b64urlDecode(
        body["clientDataJSON"].get<std::string>());
    auto sig = pk::b64urlDecode(
        body["signature"].get<std::string>());
    std::vector<std::uint8_t> hash(SHA256_DIGEST_LENGTH);
    SHA256(cj.data(), cj.size(), hash.data());

    auto db = drogon::app().getDbClient();
    db->execSqlAsync(
        "SELECT user_id, public_key FROM passkey_credentials"
        " WHERE credential_id = $1",
        [cb, authData, hash, sig, credId](
            const drogon::orm::Result& r) {
            if (r.empty()) {
                cb(::utils::jsonError(
                    drogon::k401Unauthorized,
                    "unknown", "PK_007"));
                return;
            }
            auto raw =
                r[0]["public_key"].as<std::vector<char>>();
            std::vector<std::uint8_t> pub(
                raw.begin(), raw.end());
            auto parsed =
                passkey_assert::parsePubKey(pub);
            if (!pk::verifyAssertion(
                    parsed, authData, hash, sig)) {
                cb(::utils::jsonError(
                    drogon::k401Unauthorized,
                    "sig", "PK_008"));
                return;
            }
            passkey_assert::issuePasskeySession(
                r[0]["user_id"].as<std::string>(),
                credId, cb);
        },
        [cb](const drogon::orm::DrogonDbException&) {
            cb(::utils::jsonError(
                drogon::k500InternalServerError,
                "db", "PK_009"));
        },
        credId);
}

} // namespace controllers
