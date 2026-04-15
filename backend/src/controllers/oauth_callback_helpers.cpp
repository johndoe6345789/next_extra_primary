/**
 * @file oauth_callback_helpers.cpp
 * @brief Implementations of OAuth callback helpers.
 */

#include "oauth_callback_helpers.h"

#include "../services/auth/oauth/GithubProvider.h"
#include "../services/auth/oauth/GoogleProvider.h"
#include "../services/auth/oauth/MicrosoftProvider.h"

#include <drogon/Cookie.h>

namespace controllers::oauth_cb
{

services::auth::oauth::UserProfile mapProfile(
    const std::string& provider,
    const nlohmann::json& j)
{
    namespace oa = services::auth::oauth;
    if (provider == "google")
        return oa::google::mapProfile(j);
    if (provider == "github")
        return oa::github::mapProfile(j);
    if (provider == "microsoft")
        return oa::microsoft::mapProfile(j);
    return {};
}

void attachSso(const drogon::HttpResponsePtr& r,
               const std::string& refreshToken)
{
    drogon::Cookie sso("nextra_sso", refreshToken);
    sso.setHttpOnly(true);
    sso.setPath("/");
    sso.setSameSite(drogon::Cookie::SameSite::kLax);
    sso.setMaxAge(30 * 24 * 3600);
    r->addCookie(sso);
}

} // namespace controllers::oauth_cb
