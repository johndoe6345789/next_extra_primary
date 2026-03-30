#pragma once
/**
 * @file openapi_gamification.h
 * @brief OpenAPI paths for gamification endpoints.
 */

#include <nlohmann/json.hpp>

namespace docs
{

/** @brief Register gamification paths. */
inline void gamificationPaths(nlohmann::json& paths)
{
    using json = nlohmann::json;

    paths["/gamification/badges"]["get"] =
        json::parse(R"json({
        "tags": ["Gamification"],
        "summary": "List all badges",
        "responses": {
            "200": {"description": "Badge list"}
        }
    })json");

    paths["/gamification/leaderboard"]["get"] =
        json::parse(R"json({
        "tags": ["Gamification"],
        "summary": "Get leaderboard",
        "parameters": [
            {"name": "period", "in": "query",
             "schema": {"type": "string", "default": "weekly"}},
            {"name": "limit", "in": "query",
             "schema": {"type": "integer", "default": 10}}
        ],
        "responses": {
            "200": {"description": "Leaderboard entries"}
        }
    })json");

    paths["/gamification/streaks/me"]["get"] =
        json::parse(R"json({
        "tags": ["Gamification"],
        "summary": "Get my streaks",
        "security": [{"bearerAuth": []}],
        "responses": {
            "200": {"description": "Streak data"}
        }
    })json");

    paths["/gamification/points/award"]["post"] =
        json::parse(R"json({
        "tags": ["Gamification"],
        "summary": "Award points (admin)",
        "security": [{"bearerAuth": []}],
        "requestBody": {
            "required": true,
            "content": {
                "application/json": {
                    "schema": {
                        "type": "object",
                        "required": ["user_id", "points"],
                        "properties": {
                            "user_id": {"type": "string"},
                            "points": {"type": "integer"}
                        }
                    }
                }
            }
        },
        "responses": {
            "200": {"description": "Points awarded"},
            "403": {"description": "Forbidden"}
        }
    })json");

    paths["/gamification/progress/me"]["get"] =
        json::parse(R"json({
        "tags": ["Gamification"],
        "summary": "Get my progress",
        "security": [{"bearerAuth": []}],
        "responses": {
            "200": {"description": "Progress data"}
        }
    })json");
}

} // namespace docs
