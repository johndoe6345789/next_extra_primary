/**
 * @file ForumBoardRow.cpp
 * @brief Shared helpers for forum board controllers.
 */
#include "ForumBoardController.h"

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>

using json = nlohmann::json;
using namespace drogon::orm;

namespace controllers
{

/**
 * @brief Convert a forum_boards DB row to JSON.
 * @param row A row from a forum_boards SELECT.
 * @return JSON object with camelCase keys.
 */
json boardRowToJson(const Row& row)
{
    return {
        {"slug",
            row["slug"].as<std::string>()},
        {"label",
            row["label"].as<std::string>()},
        {"description",
            row["description"].as<std::string>()},
        {"icon",
            row["icon"].as<std::string>()},
        {"requiresAuth",
            row["requires_auth"].as<bool>()},
        {"minPosts",
            row["min_posts"].as<int>()},
        {"isGuestVisible",
            row["is_guest_visible"].as<bool>()},
        {"sortOrder",
            row["sort_order"].as<int>()},
    };
}

/**
 * @brief Build a partial SET clause for UPDATE.
 *
 * Iterates the JSON body for known board fields and
 * produces a comma-separated SET fragment list plus
 * bound string values (all coerced to string for
 * Drogon's parameter binding).
 *
 * @param body    Parsed JSON request body.
 * @param sets    Output: comma-separated "col=$N ..."
 * @param vals    Output: string-serialised bind values.
 */
void buildBoardSets(
    const json& body,
    std::string& sets,
    std::vector<std::string>& vals)
{
    int idx = 1;
    auto add = [&](const char* col, std::string v) {
        if (!sets.empty()) sets += ", ";
        sets += std::string(col) + "=$" +
            std::to_string(idx++);
        vals.push_back(std::move(v));
    };
    if (body.contains("label"))
        add("label", body["label"]
            .get<std::string>());
    if (body.contains("description"))
        add("description", body["description"]
            .get<std::string>());
    if (body.contains("requiresAuth"))
        add("requires_auth",
            body["requiresAuth"].get<bool>()
                ? "true" : "false");
    if (body.contains("isGuestVisible"))
        add("is_guest_visible",
            body["isGuestVisible"].get<bool>()
                ? "true" : "false");
    if (body.contains("minPosts"))
        add("min_posts",
            std::to_string(
                body["minPosts"].get<int>()));
    if (body.contains("sortOrder"))
        add("sort_order",
            std::to_string(
                body["sortOrder"].get<int>()));
}

} // namespace controllers
