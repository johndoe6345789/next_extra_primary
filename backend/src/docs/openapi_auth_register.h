#pragma once
/**
 * @file openapi_auth_register.h
 * @brief OpenAPI path for the register endpoint.
 */

#include <nlohmann/json.hpp>

namespace docs
{

/**
 * @brief Register the /auth/register path.
 * @param paths  The OpenAPI paths object.
 */
inline void authRegisterPath(
    nlohmann::json& paths)
{
    using json = nlohmann::json;

    paths["/auth/register"]["post"] =
        json::parse(R"json({
        "tags": ["Auth"],
        "summary": "Register a new user",
        "requestBody": {
            "required": true,
            "content": {
                "application/json": {
                    "schema": {
                        "type": "object",
                        "required": [
                            "email",
                            "username",
                            "password"
                        ],
                        "properties": {
                            "email":
                                {"type": "string"},
                            "username":
                                {"type": "string"},
                            "password":
                                {"type": "string"},
                            "display_name":
                                {"type": "string"}
                        }
                    }
                }
            }
        },
        "responses": {
            "201": {
                "description": "User created"
            },
            "400": {
                "description": "Validation error"
            }
        }
    })json");
}

} // namespace docs
