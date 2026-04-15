/**
 * @file PasskeyAssertBegin.cpp
 * @brief POST /api/auth/passkeys/assert/begin
 *
 * Unauthenticated — starts an assertion by generating a fresh
 * challenge.  The client looks up allowCredentials locally via
 * WebAuthn discoverable credentials, so no userVerification
 * list is returned.
 */

#include "PasskeyController.h"
#include "../services/auth/passkeys/Base64Url.h"
#include "../services/auth/passkeys/ChallengeStore.h"
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

void PasskeyController::assertBegin(
    const drogon::HttpRequestPtr&, Cb&& cb)
{
    std::vector<std::uint8_t> ch(32);
    RAND_bytes(ch.data(), ch.size());
    auto key = pk::b64urlEncode(ch);
    pk::PendingChallenge pc;
    pc.challenge = ch;
    pc.isRegistration = false;
    pk::ChallengeStore::instance().put(key, pc);

    json payload = {
        {"challenge", key},
        {"rpId", "localhost"},
        {"timeout", 60000},
        {"userVerification", "preferred"}};
    cb(::utils::jsonOk(payload));
}

} // namespace controllers
