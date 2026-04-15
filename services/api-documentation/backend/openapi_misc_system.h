#pragma once
/**
 * @file openapi_misc_system.h
 * @brief OpenAPI paths for health and contact endpoints.
 */

#include <nlohmann/json.hpp>

namespace docs
{

/** @brief Health and contact paths. */
inline void miscSystemPaths(
    nlohmann::json& paths)
{
    using json = nlohmann::json;

    paths["/health"]["get"] =
        json::parse(R"json({
        "tags": ["System"],
        "summary": "Health check",
        "responses": {
            "200": {
                "description": "Service healthy"
            }
        }
    })json");

    paths["/contact"]["post"] =
        json::parse(R"json({
        "tags": ["Contact"],
        "summary": "Submit contact form",
        "requestBody": {
            "required": true,
            "content": {
                "application/json": {
                    "schema": {
                        "type": "object",
                        "required": [
                            "name",
                            "email",
                            "message"
                        ],
                        "properties": {
                            "name":
                                {"type": "string"},
                            "email":
                                {"type": "string"},
                            "message":
                                {"type": "string"}
                        }
                    }
                }
            }
        },
        "responses": {
            "200": {
                "description":
                    "Message received"
            }
        }
    })json");
}

} // namespace docs
