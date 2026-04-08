#pragma once
/**
 * @file openapi_auth.h
 * @brief OpenAPI paths for authentication endpoints.
 */

#include "openapi_auth_login.h"
#include "openapi_auth_session.h"

namespace docs
{

/** @brief Register all auth paths into the spec. */
inline void authPaths(nlohmann::json& paths)
{
    authLoginPaths(paths);
    authSessionPaths(paths);
}

} // namespace docs
