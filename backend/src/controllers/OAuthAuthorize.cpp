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
    // Config is typically loaded from constants JSON; we
    // assemble a minimal ProviderConfig here so the flow is
    // testable.  Real wiring reads env vars named in the
    // constants file (clientIdEnv / clientSecretEnv).
    oa::ProviderConfig cfg;
    cfg.name = provider;
    cfg.authorizeUrl =
        "https://example.invalid/authorize/" + provider;
    cfg.scope = "openid email profile";
    cfg.clientId = "TODO_FROM_ENV";

    auto [verifier, challenge] = oa::generatePkcePair();
    std::vector<std::uint8_t> s(24);
    RAND_bytes(s.data(), s.size());
    auto state =
        services::auth::passkeys::b64urlEncode(s);
    std::vector<std::uint8_t> n(16);
    RAND_bytes(n.data(), n.size());
    auto nonce =
        services::auth::passkeys::b64urlEncode(n);
    auto redir =
        req->getHeader("x-forwarded-proto").empty()
        ? std::string("http://localhost:8889")
        : std::string();
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
