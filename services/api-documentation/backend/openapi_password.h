#pragma once
/**
 * @file openapi_password.h
 * @brief OpenAPI paths for password/email endpoints.
 */

#include <nlohmann/json.hpp>

namespace docs
{

/** @brief Register password/email paths. */
inline void passwordPaths(nlohmann::json& paths)
{
    using json = nlohmann::json;

    paths["/auth/forgot-password"]["post"] =
        json::parse(R"json({
        "tags": ["Auth"],
        "summary": "Request password reset email",
        "requestBody": {
            "required": true,
            "content": {
                "application/json": {
                    "schema": {
                        "type": "object",
                        "required": ["email"],
                        "properties": {
                            "email": {"type": "string"}
                        }
                    }
                }
            }
        },
        "responses": {
            "200": {"description": "Reset email sent"}
        }
    })json");

    paths["/auth/reset-password/{token}"]["post"] =
        json::parse(R"json({
        "tags": ["Auth"],
        "summary": "Reset password with token",
        "parameters": [{
            "name": "token", "in": "path",
            "required": true,
            "schema": {"type": "string"}
        }],
        "requestBody": {
            "required": true,
            "content": {
                "application/json": {
                    "schema": {
                        "type": "object",
                        "required": ["password"],
                        "properties": {
                            "password": {"type": "string"}
                        }
                    }
                }
            }
        },
        "responses": {
            "200": {"description": "Password reset"},
            "400": {"description": "Invalid or expired token"}
        }
    })json");

    paths["/auth/confirm/{token}"]["get"] =
        json::parse(R"json({
        "tags": ["Auth"],
        "summary": "Confirm email address",
        "parameters": [{
            "name": "token", "in": "path",
            "required": true,
            "schema": {"type": "string"}
        }],
        "responses": {
            "200": {"description": "Email confirmed"},
            "400": {"description": "Invalid token"}
        }
    })json");
}

} // namespace docs
