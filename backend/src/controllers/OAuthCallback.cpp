/**
 * @file OAuthCallback.cpp
 * @brief GET /api/auth/oauth/:provider/callback — exchange
 *        code, fetch userinfo, mint Nextra session.
 */

#include "OAuthController.h"
#include "oauth_callback_helpers.h"
#include "../services/auth/oauth/OAuthClient.h"
#include "../services/auth/oauth/OAuthIdentityLogin.h"
#include "../services/auth/oauth/ProviderConfigLoader.h"
#include "../services/auth/oauth/StateStore.h"
#include "../services/auth/oauth/UserInfoFetch.h"
#include "../utils/JsonResponse.h"

#include <nlohmann/json.hpp>
#include <string>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;
namespace oa = services::auth::oauth;
namespace cb_h = controllers::oauth_cb;

namespace controllers
{

static void runExchange(
    const oa::StoredState& s,
    const std::string& provider,
    const std::string& code, Cb cb)
{
    auto mc = oa::loadProviderConfig(provider);
    if (!mc) {
        cb(::utils::jsonError(
            drogon::k400BadRequest, "provider",
            "OAUTH_000"));
        return;
    }
    auto tok = oa::exchangeCode(
        *mc, code, s.codeVerifier, s.redirectUri);
    if (tok.accessToken.empty()) {
        cb(::utils::jsonError(
            drogon::k502BadGateway, "token",
            "OAUTH_004"));
        return;
    }
    auto info = oa::fetchUserInfo(*mc, tok.accessToken);
    if (info.is_null()) {
        cb(::utils::jsonError(
            drogon::k502BadGateway, "userinfo",
            "OAUTH_005"));
        return;
    }
    auto profile = cb_h::mapProfile(provider, info);
    oa::loginViaOAuth(
        provider, profile,
        [cb](bool ok, json payload) {
            if (!ok) {
                cb(::utils::jsonError(
                    drogon::k500InternalServerError,
                    "db", "OAUTH_006"));
                return;
            }
            auto resp = ::utils::jsonOk(payload);
            cb_h::attachSso(
                resp,
                payload["tokens"]["refreshToken"]
                    .get<std::string>());
            cb(resp);
        });
}

void OAuthController::callback(
    const drogon::HttpRequestPtr& req, Cb&& cb,
    const std::string& provider)
{
    auto state = req->getParameter("state");
    auto code = req->getParameter("code");
    if (state.empty() || code.empty()) {
        cb(::utils::jsonError(
            drogon::k400BadRequest, "missing",
            "OAUTH_002"));
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
            runExchange(*s, provider, code, cb);
        });
}

} // namespace controllers
