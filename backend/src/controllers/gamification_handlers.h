#pragma once
/**
 * @file gamification_handlers.h
 * @brief Helper handlers for GamificationController
 *        badge listing and point awarding.
 */

#include "../utils/JsonResponse.h"

#include <nlohmann/json.hpp>
#include <string>

namespace controllers
{

using json = nlohmann::json;

/**
 * @brief Build the static badge list response.
 * @return JSON array of available badges.
 */
inline auto buildBadgeList() -> json
{
    return json::array(
        {{{"id", "early_adopter"},
          {"name", "Early Adopter"},
          {"description", "Joined during beta"},
          {"icon", "star"}},
         {{"id", "first_chat"},
          {"name", "First Chat"},
          {"description",
           "Completed first AI chat"},
          {"icon", "chat"}}});
}

/**
 * @brief Validate and parse an award-points body.
 * @param req The HTTP request.
 * @param cb  Response callback.
 * @return Parsed JSON or nullopt if invalid.
 */
inline auto parseAwardBody(
    const drogon::HttpRequestPtr& req)
    -> std::optional<json>
{
    auto role = req->attributes()
        ->get<std::string>("user_role");
    if (role != "admin") {
        return std::nullopt;
    }

    auto body = json::parse(
        req->bodyData(),
        req->bodyData() + req->bodyLength(),
        nullptr, false);
    if (body.is_discarded()
        || !body.contains("user_id")
        || !body.contains("points")) {
        return std::nullopt;
    }
    return body;
}

} // namespace controllers
