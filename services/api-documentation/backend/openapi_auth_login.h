#pragma once
/**
 * @file openapi_auth_login.h
 * @brief OpenAPI paths for register and login.
 */

#include "openapi_auth_register.h"

#include <nlohmann/json.hpp>

namespace docs
{

/** @brief Register and login paths. */
inline void authLoginPaths(
    nlohmann::json& paths)
{
    using json = nlohmann::json;

    authRegisterPath(paths);

    paths["/auth/login"]["post"] =
        json::parse(R"json({
        "tags": ["Auth"],
        "summary": "Login and receive tokens",
        "requestBody": {
            "required": true,
            "content": {
                "application/json": {
                    "schema": {
                        "type": "object",
                        "required": [
                            "email",
                            "password"
                        ],
                        "properties": {
                            "email":
                                {"type": "string"},
                            "password":
                                {"type": "string"}
                        }
                    }
                }
            }
        },
        "responses": {
            "200": {
                "description": "JWT tokens"
            },
            "401": {
                "description":
                    "Invalid credentials"
            }
        }
    })json");
}

} // namespace docs
