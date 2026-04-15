#pragma once
/**
 * @file openapi_spec.h
 * @brief Assembles the full OpenAPI 3.0 spec from parts.
 */

#include "openapi_auth.h"
#include "openapi_base.h"
#include "openapi_chat.h"
#include "openapi_gamification.h"
#include "openapi_misc.h"
#include "openapi_notifications.h"
#include "openapi_password.h"
#include "openapi_users.h"

namespace docs
{

/** @brief Build the complete OpenAPI JSON spec. */
inline auto buildSpec() -> nlohmann::json
{
    auto spec = baseSpec();
    auto& paths = spec["paths"];

    authPaths(paths);
    passwordPaths(paths);
    userPaths(paths);
    chatPaths(paths);
    gamificationPaths(paths);
    notificationPaths(paths);
    miscPaths(paths);

    return spec;
}

} // namespace docs
