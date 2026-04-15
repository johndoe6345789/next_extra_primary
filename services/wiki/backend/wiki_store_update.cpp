/**
 * @file wiki_store_update.cpp
 * @brief Update + delete paths for WikiStore.
 *        Each update produces a new revision row.
 */

#include "WikiStore.h"
#include <spdlog/spdlog.h>

namespace services::wiki
{

void WikiStore::updatePage(
    std::int64_t id,
    const std::string& title,
    const std::string& bodyMd,
    const std::string& authorId,
    Callback ok, ErrCallback err)
{
    static const std::string kUpd = R"(
        UPDATE wiki_pages
        SET title = $2,
            body_md = $3,
            updated_by = NULLIF($4,'')::uuid,
            updated_at = NOW()
        WHERE id = $1
        RETURNING id
    )";
    static const std::string kRev = R"(
        INSERT INTO wiki_revisions
          (page_id, rev, title, body_md,
           author_id)
        VALUES
          ($1,
           (SELECT COALESCE(MAX(rev),0) + 1
            FROM wiki_revisions
            WHERE page_id = $1),
           $2, $3,
           NULLIF($4,'')::uuid)
        RETURNING rev
    )";
    *db() << kUpd << id << title << bodyMd
          << authorId >>
        [=, this](const drogon::orm::Result& r) {
            if (r.empty()) {
                err(drogon::k404NotFound,
                    "Page not found");
                return;
            }
            *db() << kRev << id << title
                  << bodyMd << authorId >>
                [ok, id](
                    const drogon::orm::Result& rr) {
                    int newRev = rr.empty()
                        ? 1
                        : rr[0]["rev"].as<int>();
                    ok({
                        {"id", id},
                        {"rev", newRev},
                    });
                } >>
                [err](
                    const drogon::orm::
                        DrogonDbException& e) {
                    spdlog::error(
                        "wiki rev ins: {}",
                        e.base().what());
                    err(
                        drogon::
                            k500InternalServerError,
                        "Revision insert failed");
                };
        } >>
        [err](const drogon::orm::DrogonDbException& e) {
            spdlog::error("wiki update: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                "Failed to update page");
        };
}

void WikiStore::deletePage(
    std::int64_t id, Callback ok, ErrCallback err)
{
    static const std::string kDel =
        "DELETE FROM wiki_pages WHERE id = $1";
    *db() << kDel << id >>
        [ok](const drogon::orm::Result&) {
            ok({{"ok", true}});
        } >>
        [err](const drogon::orm::DrogonDbException& e) {
            spdlog::error("wiki delete: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                "Failed to delete page");
        };
}

} // namespace services::wiki
