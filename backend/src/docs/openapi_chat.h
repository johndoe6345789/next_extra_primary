#pragma once
/**
 * @file openapi_chat.h
 * @brief OpenAPI paths for chat/messaging endpoints.
 */

#include <nlohmann/json.hpp>

namespace docs
{

/** @brief Register chat paths into the spec. */
inline void chatPaths(nlohmann::json& paths)
{
    using json = nlohmann::json;

    paths["/chat/messages"]["post"] = json::parse(R"json({
        "tags": ["Chat"],
        "summary": "Send message to AI provider",
        "security": [{"bearerAuth": []}],
        "requestBody": {
            "required": true,
            "content": {
                "application/json": {
                    "schema": {
                        "type": "object",
                        "required": ["message"],
                        "properties": {
                            "message": {"type": "string"},
                            "provider": {
                                "type": "string",
                                "enum": ["anthropic", "openai"]
                            }
                        }
                    }
                }
            }
        },
        "responses": {
            "200": {"description": "AI response"},
            "400": {"description": "Invalid request"}
        }
    })json");

    paths["/chat/history"]["get"] = json::parse(R"json({
        "tags": ["Chat"],
        "summary": "Get paginated chat history",
        "security": [{"bearerAuth": []}],
        "parameters": [
            {"name": "page", "in": "query",
             "schema": {"type": "integer"}},
            {"name": "per_page", "in": "query",
             "schema": {"type": "integer"}}
        ],
        "responses": {
            "200": {"description": "Paginated chat history"}
        }
    })json");

    paths["/chat/history"]["delete"] = json::parse(R"json({
        "tags": ["Chat"],
        "summary": "Clear all chat history",
        "security": [{"bearerAuth": []}],
        "responses": {
            "200": {"description": "History cleared"}
        }
    })json");
}

} // namespace docs
