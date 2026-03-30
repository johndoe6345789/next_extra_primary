#pragma once
/**
 * @file openapi_auth.h
 * @brief OpenAPI paths for authentication endpoints.
 */

#include <nlohmann/json.hpp>

namespace docs
{

/** @brief Register auth paths into the spec. */
inline void authPaths(nlohmann::json& paths)
{
    using json = nlohmann::json;

    paths["/auth/register"]["post"] = json::parse(R"json({
        "tags": ["Auth"],
        "summary": "Register a new user",
        "requestBody": {
            "required": true,
            "content": {
                "application/json": {
                    "schema": {
                        "type": "object",
                        "required": ["email", "username", "password"],
                        "properties": {
                            "email": {"type": "string"},
                            "username": {"type": "string"},
                            "password": {"type": "string"},
                            "display_name": {"type": "string"}
                        }
                    }
                }
            }
        },
        "responses": {
            "201": {"description": "User created"},
            "400": {"description": "Validation error"}
        }
    })json");

    paths["/auth/login"]["post"] = json::parse(R"json({
        "tags": ["Auth"],
        "summary": "Login and receive tokens",
        "requestBody": {
            "required": true,
            "content": {
                "application/json": {
                    "schema": {
                        "type": "object",
                        "required": ["email", "password"],
                        "properties": {
                            "email": {"type": "string"},
                            "password": {"type": "string"}
                        }
                    }
                }
            }
        },
        "responses": {
            "200": {"description": "JWT tokens"},
            "401": {"description": "Invalid credentials"}
        }
    })json");

    paths["/auth/logout"]["post"] = json::parse(R"json({
        "tags": ["Auth"],
        "summary": "Invalidate current token",
        "security": [{"bearerAuth": []}],
        "responses": {
            "200": {"description": "Logged out"}
        }
    })json");

    paths["/auth/refresh"]["post"] = json::parse(R"json({
        "tags": ["Auth"],
        "summary": "Refresh access token",
        "requestBody": {
            "required": true,
            "content": {
                "application/json": {
                    "schema": {
                        "type": "object",
                        "properties": {
                            "refresh_token": {"type": "string"}
                        }
                    }
                }
            }
        },
        "responses": {
            "200": {"description": "New access token"},
            "401": {"description": "Invalid refresh token"}
        }
    })json");

    paths["/auth/me"]["get"] = json::parse(R"json({
        "tags": ["Auth"],
        "summary": "Get current user profile",
        "security": [{"bearerAuth": []}],
        "responses": {
            "200": {"description": "User profile"}
        }
    })json");
}

} // namespace docs
