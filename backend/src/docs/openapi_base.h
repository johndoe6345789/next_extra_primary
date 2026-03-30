#pragma once
/**
 * @file openapi_base.h
 * @brief OpenAPI 3.0 base document (info, servers, security).
 */

#include <nlohmann/json.hpp>

namespace docs
{

/** @brief Return the OpenAPI base skeleton. */
inline auto baseSpec() -> nlohmann::json
{
    return nlohmann::json::parse(R"json({
        "openapi": "3.0.3",
        "info": {
            "title": "Nextra API",
            "version": "1.0.0",
            "description": "Gamified learning platform REST API."
        },
        "servers": [{"url": "/api"}],
        "components": {
            "securitySchemes": {
                "bearerAuth": {
                    "type": "http",
                    "scheme": "bearer",
                    "bearerFormat": "JWT"
                }
            },
            "schemas": {
                "Error": {
                    "type": "object",
                    "properties": {
                        "error": {"type": "string"}
                    }
                },
                "Pagination": {
                    "type": "object",
                    "properties": {
                        "total": {"type": "integer"},
                        "page": {"type": "integer"},
                        "per_page": {"type": "integer"},
                        "total_pages": {"type": "integer"}
                    }
                }
            }
        },
        "paths": {}
    })json");
}

} // namespace docs
