/**
 * @file OAuthAuthorize.cpp
 * @brief GET /api/auth/oauth/:provider/authorize
 *
 * Generates PKCE + state, persists them, then 302-redirects
 * to the provider's authorize URL.  Provider config is read
 * from backend/src/constants/auth-extras.json.
 */

#include "OAuthController.h"
#include "../services/auth/oauth/OAuthClient.h"
#include "../services/auth/oauth/ProviderConfigLoader.h"
#include "../services/auth/oauth/StateStore.h"
#include "../services/auth/passkeys/Base64Url.h"
#include "../utils/JsonResponse.h"

#include <drogon/HttpResponse.h>
#include <openssl/rand.h>
#include <string>
#include <vector>

using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;
namespace oa = services::auth::oauth;

namespace controllers
{

void OAuthController::authorize(
    const drogon::HttpRequestPtr& req, Cb&& cb,
    const std::string& provider)
{
    auto maybeCfg = oa::loadProviderConfig(provider);
    if (!maybeCfg) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "unknown provider", "OAUTH_000"));
        return;
    }
    auto cfg = *maybeCfg;

    auto [verifier, challenge] = oa::generatePkcePair();
    std::vector<std::uint8_t> s(24);
    RAND_bytes(s.data(), s.size());
    auto state =
        services::auth::passkeys::b64urlEncode(s);
    std::vector<std::uint8_t> n(16);
    RAND_bytes(n.data(), n.size());
    auto nonce =
        services::auth::passkeys::b64urlEncode(n);
    auto redir = oa::defaultPortalOrigin();
    redir += "/api/auth/oauth/" + provider + "/callback";

    oa::StoredState st{
        state, nonce, redir, provider, verifier};
    oa::putState(st, [cb, cfg, state, challenge, redir](
                            bool ok) {
        if (!ok) {
            cb(::utils::jsonError(
                drogon::k500InternalServerError,
                "state", "OAUTH_001"));
            return;
        }
        auto url = oa::buildAuthorizeUrl(
            cfg, state, challenge, redir);
        auto r = drogon::HttpResponse::newRedirectionResponse(
            url);
        cb(r);
    });
}

} // namespace controllers
