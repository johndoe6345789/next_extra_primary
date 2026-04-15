#pragma once
/**
 * @file passkey_assert_helpers.h
 * @brief Helpers for PasskeyAssertFinish.cpp.
 */

#include "../services/auth/passkeys/Cbor.h"
#include "../services/auth/passkeys/CoseKey.h"

#include <cstdint>
#include <drogon/HttpResponse.h>
#include <functional>
#include <string>
#include <vector>

namespace controllers::passkey_assert
{

/** @brief Parse a CBOR-encoded COSE_Key bytes blob. */
inline services::auth::passkeys::CoseKeyParsed parsePubKey(
    const std::vector<std::uint8_t>& pub)
{
    namespace pk = services::auth::passkeys;
    std::size_t off = 0;
    auto v = pk::cbor::decode(pub, off);
    auto m = std::get_if<pk::cbor::Map>(&v->data);
    return pk::parseCoseKey(*m);
}

/**
 * @brief Build the signed-in JSON response, attach the
 *        nextra_sso cookie, and async-touch last_used_at.
 * @param userId Local user UUID from the credential row.
 * @param credId Raw credential id bytes for the UPDATE.
 * @param cb     Controller response callback to invoke.
 */
void issuePasskeySession(
    const std::string& userId,
    const std::vector<std::uint8_t>& credId,
    std::function<void(
        const drogon::HttpResponsePtr&)> cb);

} // namespace controllers::passkey_assert
