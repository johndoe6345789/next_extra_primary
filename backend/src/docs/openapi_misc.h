#pragma once
/**
 * @file openapi_misc.h
 * @brief OpenAPI paths for contact, dashboard, features,
 *        health, and search endpoints.
 */

#include <nlohmann/json.hpp>

namespace docs
{

/** @brief Register miscellaneous paths. */
inline void miscPaths(nlohmann::json& paths)
{
    using json = nlohmann::json;

    paths["/health"]["get"] = json::parse(R"json({
        "tags": ["System"],
        "summary": "Health check",
        "responses": {
            "200": {"description": "Service healthy"}
        }
    })json");

    paths["/contact"]["post"] = json::parse(R"json({
        "tags": ["Contact"],
        "summary": "Submit contact form",
        "requestBody": {
            "required": true,
            "content": {
                "application/json": {
                    "schema": {
                        "type": "object",
                        "required": ["name", "email", "message"],
                        "properties": {
                            "name": {"type": "string"},
                            "email": {"type": "string"},
                            "message": {"type": "string"}
                        }
                    }
                }
            }
        },
        "responses": {
            "200": {"description": "Message received"}
        }
    })json");

    paths["/dashboard/stats"]["get"] = json::parse(R"json({
        "tags": ["Dashboard"],
        "summary": "Get dashboard statistics",
        "security": [{"bearerAuth": []}],
        "responses": {
            "200": {"description": "Aggregated stats"}
        }
    })json");

    paths["/features"]["get"] = json::parse(R"json({
        "tags": ["Features"],
        "summary": "List feature toggles",
        "responses": {
            "200": {"description": "Feature toggle list"}
        }
    })json");

    paths["/features/{key}/toggle"]["patch"] =
        json::parse(R"json({
        "tags": ["Features"],
        "summary": "Toggle feature (admin)",
        "security": [{"bearerAuth": []}],
        "parameters": [{
            "name": "key", "in": "path",
            "required": true,
            "schema": {"type": "string"}
        }],
        "responses": {
            "200": {"description": "Toggled"},
            "403": {"description": "Forbidden"}
        }
    })json");

    paths["/search"]["get"] = json::parse(R"json({
        "tags": ["Search"],
        "summary": "Full-text search",
        "parameters": [
            {"name": "q", "in": "query",
             "required": true,
             "schema": {"type": "string"}},
            {"name": "page", "in": "query",
             "schema": {"type": "integer"}},
            {"name": "size", "in": "query",
             "schema": {"type": "integer"}}
        ],
        "responses": {
            "200": {"description": "Search results"}
        }
    })json");
}

} // namespace docs
