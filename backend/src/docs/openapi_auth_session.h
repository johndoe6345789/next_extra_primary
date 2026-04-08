#pragma once
/**
 * @file openapi_auth_session.h
 * @brief OpenAPI paths for logout, refresh, and me.
 */

#include <nlohmann/json.hpp>

namespace docs
{

/** @brief Logout, refresh, me paths. */
inline void authSessionPaths(
    nlohmann::json& paths)
{
    using json = nlohmann::json;

    paths["/auth/logout"]["post"] =
        json::parse(R"json({
        "tags": ["Auth"],
        "summary": "Invalidate current token",
        "security": [{"bearerAuth": []}],
        "responses": {
            "200": {
                "description": "Logged out"
            }
        }
    })json");

    paths["/auth/refresh"]["post"] =
        json::parse(R"json({
        "tags": ["Auth"],
        "summary": "Refresh access token",
        "requestBody": {
            "required": true,
            "content": {
                "application/json": {
                    "schema": {
                        "type": "object",
                        "properties": {
                            "refresh_token":
                                {"type": "string"}
                        }
                    }
                }
            }
        },
        "responses": {
            "200": {
                "description":
                    "New access token"
            },
            "401": {
                "description":
                    "Invalid refresh token"
            }
        }
    })json");

    paths["/auth/me"]["get"] =
        json::parse(R"json({
        "tags": ["Auth"],
        "summary": "Get current user profile",
        "security": [{"bearerAuth": []}],
        "responses": {
            "200": {
                "description": "User profile"
            }
        }
    })json");
}

} // namespace docs
