/**
 * @file wiki_store_read.cpp
 * @brief Read-side queries for WikiStore.
 */

#include "WikiStore.h"
#include <spdlog/spdlog.h>

namespace services::wiki
{

static json rowToPage(
    const drogon::orm::Row& r)
{
    return {
        {"id", r["id"].as<std::int64_t>()},
        {"parentId",
         r["parent_id"].isNull()
             ? json(nullptr)
             : json(r["parent_id"]
                        .as<std::int64_t>())},
        {"slug", r["slug"].as<std::string>()},
        {"title", r["title"].as<std::string>()},
        {"bodyMd",
         r["body_md"].as<std::string>()},
        {"path", r["path"].as<std::string>()},
        {"depth", r["depth"].as<int>()},
        {"updatedAt",
         r["updated_at"].as<std::string>()},
    };
}

void WikiStore::listTree(
    const std::string& tenantId,
    Callback ok, ErrCallback err)
{
    static const std::string kSql = R"(
        SELECT id, parent_id, slug, title,
               body_md, path::text AS path,
               depth, updated_at
        FROM wiki_pages
        WHERE tenant_id = $1::uuid
        ORDER BY path
    )";
    *db() << kSql << tenantId >>
        [ok](const drogon::orm::Result& r) {
            auto arr = json::array();
            for (const auto& row : r)
                arr.push_back(rowToPage(row));
            ok({{"pages", arr}});
        } >>
        [err](const drogon::orm::DrogonDbException& e) {
            spdlog::error("wiki tree: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                "Failed to list wiki pages");
        };
}

void WikiStore::getPage(
    std::int64_t id, Callback ok, ErrCallback err)
{
    static const std::string kSql = R"(
        SELECT id, parent_id, slug, title,
               body_md, path::text AS path,
               depth, updated_at
        FROM wiki_pages WHERE id = $1
    )";
    *db() << kSql << id >>
        [ok, err](const drogon::orm::Result& r) {
            if (r.empty()) {
                err(drogon::k404NotFound,
                    "Page not found");
                return;
            }
            ok(rowToPage(r[0]));
        } >>
        [err](const drogon::orm::DrogonDbException& e) {
            spdlog::error("wiki get: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                "Failed to load page");
        };
}

} // namespace services::wiki
