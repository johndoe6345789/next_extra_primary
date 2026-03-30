#pragma once
/**
 * @file openapi_users.h
 * @brief OpenAPI paths for user management endpoints.
 */

#include <nlohmann/json.hpp>

namespace docs
{

/** @brief Register user paths into the spec. */
inline void userPaths(nlohmann::json& paths)
{
    using json = nlohmann::json;

    paths["/users"]["get"] = json::parse(R"json({
        "tags": ["Users"],
        "summary": "List users (admin)",
        "security": [{"bearerAuth": []}],
        "parameters": [
            {"name": "page", "in": "query",
             "schema": {"type": "integer"}},
            {"name": "per_page", "in": "query",
             "schema": {"type": "integer"}}
        ],
        "responses": {
            "200": {"description": "Paginated user list"}
        }
    })json");

    paths["/users/{id}"]["get"] = json::parse(R"json({
        "tags": ["Users"],
        "summary": "Get user public profile",
        "parameters": [{
            "name": "id", "in": "path",
            "required": true,
            "schema": {"type": "string"}
        }],
        "responses": {
            "200": {"description": "User profile"},
            "404": {"description": "Not found"}
        }
    })json");

    paths["/users/{id}"]["patch"] = json::parse(R"json({
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

    paths["/users/{id}/badges"]["get"] = json::parse(R"json({
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

    paths["/users/{id}/stats"]["get"] = json::parse(R"json({
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
