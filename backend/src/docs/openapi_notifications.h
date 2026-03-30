#pragma once
/**
 * @file openapi_notifications.h
 * @brief OpenAPI paths for notification endpoints.
 */

#include <nlohmann/json.hpp>

namespace docs
{

/** @brief Register notification paths. */
inline void notificationPaths(nlohmann::json& paths)
{
    using json = nlohmann::json;

    paths["/notifications"]["get"] = json::parse(R"json({
        "tags": ["Notifications"],
        "summary": "List notifications",
        "security": [{"bearerAuth": []}],
        "parameters": [
            {"name": "page", "in": "query",
             "schema": {"type": "integer"}},
            {"name": "per_page", "in": "query",
             "schema": {"type": "integer"}}
        ],
        "responses": {
            "200": {"description": "Paginated notifications"}
        }
    })json");

    paths["/notifications/unread-count"]["get"] =
        json::parse(R"json({
        "tags": ["Notifications"],
        "summary": "Get unread count",
        "security": [{"bearerAuth": []}],
        "responses": {
            "200": {"description": "Unread count"}
        }
    })json");

    paths["/notifications/{id}/read"]["patch"] =
        json::parse(R"json({
        "tags": ["Notifications"],
        "summary": "Mark notification read",
        "security": [{"bearerAuth": []}],
        "parameters": [{
            "name": "id", "in": "path",
            "required": true,
            "schema": {"type": "string"}
        }],
        "responses": {
            "200": {"description": "Marked read"}
        }
    })json");

    paths["/notifications/mark-all-read"]["post"] =
        json::parse(R"json({
        "tags": ["Notifications"],
        "summary": "Mark all read",
        "security": [{"bearerAuth": []}],
        "responses": {
            "200": {"description": "All marked read"}
        }
    })json");

    paths["/notifications/{id}"]["delete"] =
        json::parse(R"json({
        "tags": ["Notifications"],
        "summary": "Delete notification",
        "security": [{"bearerAuth": []}],
        "parameters": [{
            "name": "id", "in": "path",
            "required": true,
            "schema": {"type": "string"}
        }],
        "responses": {
            "200": {"description": "Deleted"}
        }
    })json");
}

} // namespace docs
