/**
 * @file wiki_store_revisions.cpp
 * @brief Revision read queries for WikiStore.
 */

#include "WikiStore.h"
#include <spdlog/spdlog.h>

namespace services::wiki
{

void WikiStore::listRevisions(
    std::int64_t pageId, Callback ok,
    ErrCallback err)
{
    static const std::string kSql = R"(
        SELECT page_id, rev, title,
               body_md, at,
               COALESCE(author_id::text, '')
                 AS author_id
        FROM wiki_revisions
        WHERE page_id = $1
        ORDER BY rev DESC
    )";
    *db() << kSql << pageId >>
        [ok](const drogon::orm::Result& r) {
            auto arr = json::array();
            for (const auto& row : r) {
                arr.push_back({
                    {"pageId",
                     row["page_id"]
                         .as<std::int64_t>()},
                    {"rev",
                     row["rev"].as<int>()},
                    {"title",
                     row["title"]
                         .as<std::string>()},
                    {"at",
                     row["at"].as<std::string>()},
                    {"authorId",
                     row["author_id"]
                         .as<std::string>()},
                });
            }
            ok({{"revisions", arr}});
        } >>
        [err](const drogon::orm::DrogonDbException& e) {
            spdlog::error("wiki revs: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                "Failed to list revisions");
        };
}

void WikiStore::getRevision(
    std::int64_t pageId, int rev,
    Callback ok, ErrCallback err)
{
    static const std::string kSql = R"(
        SELECT page_id, rev, title,
               body_md, at,
               COALESCE(author_id::text, '')
                 AS author_id
        FROM wiki_revisions
        WHERE page_id = $1 AND rev = $2
    )";
    *db() << kSql << pageId << rev >>
        [ok, err](const drogon::orm::Result& r) {
            if (r.empty()) {
                err(drogon::k404NotFound,
                    "Revision not found");
                return;
            }
            const auto& row = r[0];
            ok({
                {"pageId",
                 row["page_id"]
                     .as<std::int64_t>()},
                {"rev", row["rev"].as<int>()},
                {"title",
                 row["title"].as<std::string>()},
                {"bodyMd",
                 row["body_md"]
                     .as<std::string>()},
                {"at",
                 row["at"].as<std::string>()},
                {"authorId",
                 row["author_id"]
                     .as<std::string>()},
            });
        } >>
        [err](const drogon::orm::DrogonDbException& e) {
            spdlog::error("wiki rev: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                "Failed to load revision");
        };
}

} // namespace services::wiki
