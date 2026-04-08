#pragma once
/**
 * @file openapi_misc_features.h
 * @brief OpenAPI paths for dashboard, features, search.
 */

#include <nlohmann/json.hpp>

namespace docs
{

/** @brief Dashboard, features, search paths. */
inline void miscFeaturesPaths(
    nlohmann::json& paths)
{
    using json = nlohmann::json;

    paths["/dashboard/stats"]["get"] =
        json::parse(R"json({
        "tags": ["Dashboard"],
        "summary":
            "Get dashboard statistics",
        "security": [{"bearerAuth": []}],
        "responses": {
            "200": {
                "description":
                    "Aggregated stats"
            }
        }
    })json");

    paths["/features"]["get"] =
        json::parse(R"json({
        "tags": ["Features"],
        "summary": "List feature toggles",
        "responses": {
            "200": {
                "description":
                    "Feature toggle list"
            }
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
            "200": {
                "description": "Toggled"
            },
            "403": {
                "description": "Forbidden"
            }
        }
    })json");

    paths["/search"]["get"] =
        json::parse(R"json({
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
            "200": {
                "description":
                    "Search results"
            }
        }
    })json");
}

} // namespace docs
