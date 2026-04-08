#pragma once
/**
 * @file openapi_users.h
 * @brief OpenAPI paths for user management endpoints.
 */

#include "openapi_users_profile.h"

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
            "200": {
                "description": "Paginated user list"
            }
        }
    })json");

    paths["/users/{id}"]["get"] =
        json::parse(R"json({
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

    userProfilePaths(paths);
}

} // namespace docs
