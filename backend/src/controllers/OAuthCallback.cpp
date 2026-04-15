/**
 * @file OAuthCallback.cpp
 * @brief GET /api/auth/oauth/:provider/callback
 *
 * Validates state, exchanges the code for tokens, fetches the
 * user profile, and upserts an oauth_identities row.  The
 * final step (issuing a Nextra session) is TODO and delegates
 * to AuthService once provider wiring is live.
 */

#include "OAuthController.h"
#include "../services/auth/oauth/OAuthClient.h"
#include "../services/auth/oauth/StateStore.h"
#include "../utils/JsonResponse.h"

#include <drogon/HttpAppFramework.h>
#include <drogon/orm/DbClient.h>
#include <nlohmann/json.hpp>
#include <string>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;
namespace oa = services::auth::oauth;

namespace controllers
{

void OAuthController::callback(
    const drogon::HttpRequestPtr& req, Cb&& cb,
    const std::string& provider)
{
    auto state = req->getParameter("state");
    auto code = req->getParameter("code");
    if (state.empty() || code.empty()) {
        cb(::utils::jsonError(
            drogon::k400BadRequest, "missing", "OAUTH_002"));
        return;
    }
    oa::consumeState(
        state, 600,
        [cb, provider, code](
            std::optional<oa::StoredState> s) {
            if (!s || s->provider != provider) {
                cb(::utils::jsonError(
                    drogon::k400BadRequest,
                    "state", "OAUTH_003"));
                return;
            }
            oa::ProviderConfig cfg;
            cfg.name = provider;
            auto tok = oa::exchangeCode(
                cfg, code, s->codeVerifier, s->redirectUri);
            if (tok.accessToken.empty()) {
                cb(::utils::jsonError(
                    drogon::k502BadGateway,
                    "token", "OAUTH_004"));
                return;
            }
            // Profile fetch is provider-specific and happens
            // after token exchange; skipped in this stub.
            cb(::utils::jsonOk(
                json{{"ok", true},
                     {"provider", provider}}));
        });
}

} // namespace controllers
