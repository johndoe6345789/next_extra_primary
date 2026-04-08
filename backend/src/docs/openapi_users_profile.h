#pragma once
/**
 * @file openapi_users_profile.h
 * @brief OpenAPI paths for user profile, badges,
 *        and stats endpoints.
 */

#include <nlohmann/json.hpp>

namespace docs
{

/**
 * @brief Register user profile-related paths.
 * @param paths The OpenAPI paths object.
 */
inline void userProfilePaths(
    nlohmann::json& paths)
{
    using json = nlohmann::json;

    paths["/users/{id}"]["patch"] =
        json::parse(R"json({
        "tags": ["Users"],
        "summary": "Update own profile",
        "security": [{"bearerAuth": []}],
        "parameters": [{
            "name": "id", "in": "path",
            "required": true,
            "schema": {"type": "string"}
        }],
        "requestBody": {
            "required": true,
            "content": {
                "application/json": {
                    "schema": {"type": "object"}
                }
            }
        },
        "responses": {
            "200": {"description": "Profile updated"},
            "403": {"description": "Forbidden"}
        }
    })json");

    paths["/users/{id}/badges"]["get"] =
        json::parse(R"json({
        "tags": ["Users"],
        "summary": "Get user badges",
        "parameters": [{
            "name": "id", "in": "path",
            "required": true,
            "schema": {"type": "string"}
        }],
        "responses": {
            "200": {"description": "Badge list"}
        }
    })json");

    paths["/users/{id}/stats"]["get"] =
        json::parse(R"json({
        "tags": ["Users"],
        "summary": "Get user gamification stats",
        "parameters": [{
            "name": "id", "in": "path",
            "required": true,
            "schema": {"type": "string"}
        }],
        "responses": {
            "200": {"description": "Gamification stats"}
        }
    })json");
}

} // namespace docs
