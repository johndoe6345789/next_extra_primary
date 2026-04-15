/**
 * @file PasskeyRegisterBegin.cpp
 * @brief POST /api/auth/passkeys/register/begin
 *
 * Generates a fresh 32-byte challenge, stashes it in the
 * ChallengeStore keyed by user id, and returns the
 * PublicKeyCredentialCreationOptions JSON payload.
 */

#include "PasskeyController.h"
#include "../services/auth/passkeys/Base64Url.h"
#include "../services/auth/passkeys/ChallengeStore.h"
#include "../services/auth/passkeys/RpConfig.h"
#include "../utils/JsonResponse.h"

#include <nlohmann/json.hpp>
#include <openssl/rand.h>
#include <string>
#include <vector>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;
namespace pk = services::auth::passkeys;

namespace controllers
{

void PasskeyController::registerBegin(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto uid = req->attributes()
                   ->get<std::string>("user_id");
    std::vector<std::uint8_t> ch(32);
    RAND_bytes(ch.data(), ch.size());
    auto key = pk::b64urlEncode(ch);
    pk::PendingChallenge pc;
    pc.userId = uid;
    pc.challenge = ch;
    pc.isRegistration = true;
    pk::ChallengeStore::instance().put(key, pc);

    const auto& rp = pk::RpConfig::instance();
    json payload = {
        {"challenge", key},
        {"rp", {{"id", rp.id()},
                {"name", rp.name()}}},
        {"user", {{"id", uid},
                  {"name", uid},
                  {"displayName", uid}}},
        {"pubKeyCredParams", json::array({
            json{{"type", "public-key"}, {"alg", -7}},
            json{{"type", "public-key"}, {"alg", -257}}})},
        {"timeout", 60000},
        {"attestation", "none"}};
    cb(::utils::jsonOk(payload));
}

} // namespace controllers
