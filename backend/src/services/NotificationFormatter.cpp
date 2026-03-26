/**
 * @file NotificationFormatter.cpp
 * @brief Row-to-JSON conversion helpers for notifications.
 */

#include "services/NotificationFormatter.h"

namespace services
{

auto NotificationFormatter::rowToJson(const drogon::orm::Row& r) -> json
{
    json n = {{"id", r["id"].as<std::string>()},
              {"userId", r["user_id"].as<std::string>()},
              {"title", r["title"].as<std::string>()},
              {"body", r["body"].as<std::string>()},
              {"type", r["type"].as<std::string>()},
              {"read", r["read"].as<bool>()},
              {"createdAt", r["created_at"].as<std::string>()}};

    try {
        n["metadata"] = json::parse(r["metadata"].as<std::string>());
    } catch (...) {
        n["metadata"] = json::object();
    }

    return n;
}

} // namespace services
