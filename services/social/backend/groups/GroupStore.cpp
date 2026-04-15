/**
 * @file GroupStore.cpp
 * @brief Group create / find / list queries (7.6).
 */

#include "GroupStore.h"

#include <drogon/drogon.h>

using namespace drogon;
using namespace drogon::orm;

namespace services::social::groups
{

std::int64_t GroupStore::create(
    const std::string& slug,
    const std::string& name,
    const std::string& description)
{
    auto db = app().getDbClient();
    auto r = db->execSqlSync(
        "INSERT INTO groups "
        "(slug, name, description) "
        "VALUES ($1, $2, $3) RETURNING id",
        slug, name, description);
    return r[0]["id"].as<std::int64_t>();
}

std::optional<nlohmann::json>
GroupStore::findBySlug(const std::string& slug)
{
    auto db = app().getDbClient();
    auto r = db->execSqlSync(
        "SELECT id, slug, name, description, "
        "created_at::text AS ca FROM groups "
        "WHERE slug = $1", slug);
    if (r.empty()) return std::nullopt;
    const auto& row = r[0];
    return nlohmann::json{
        {"id",          row["id"].as<std::int64_t>()},
        {"slug",        row["slug"].as<std::string>()},
        {"name",        row["name"].as<std::string>()},
        {"description",
         row["description"].as<std::string>()},
        {"created_at",  row["ca"].as<std::string>()},
    };
}

nlohmann::json GroupStore::listAll(int limit)
{
    auto db = app().getDbClient();
    auto r = db->execSqlSync(
        "SELECT id, slug, name, description, "
        "created_at::text AS ca FROM groups "
        "ORDER BY created_at DESC LIMIT $1", limit);
    nlohmann::json out = nlohmann::json::array();
    for (const auto& row : r) {
        out.push_back({
            {"id",   row["id"].as<std::int64_t>()},
            {"slug", row["slug"].as<std::string>()},
            {"name", row["name"].as<std::string>()},
            {"description",
             row["description"].as<std::string>()},
            {"created_at",
             row["ca"].as<std::string>()},
        });
    }
    return out;
}

} // namespace services::social::groups
