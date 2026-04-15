/**
 * @file wiki_store_write.cpp
 * @brief Create path for WikiStore. Resolves the
 *        parent ltree path + depth, then hands
 *        off to insertPageRow.
 */

#include "WikiStore.h"
#include "wiki_store_insert.h"
#include <spdlog/spdlog.h>

namespace services::wiki
{

static std::string childPath(
    const std::string& parentPath,
    const std::string& slug)
{
    if (parentPath.empty()) return slug;
    return parentPath + "." + slug;
}

void WikiStore::createPage(
    const std::string& tenantId,
    std::optional<std::int64_t> parent,
    const std::string& slug,
    const std::string& title,
    const std::string& bodyMd,
    const std::string& authorId,
    Callback ok, ErrCallback err)
{
    auto c = db();
    if (!parent) {
        insertPageRow(
            c,
            {tenantId, parent, slug, title,
             bodyMd, slug, 0, authorId},
            ok, err);
        return;
    }
    static const std::string kPar = R"(
        SELECT path::text AS path, depth
        FROM wiki_pages WHERE id = $1
    )";
    *c << kPar << *parent >>
        [=](const drogon::orm::Result& r) {
            if (r.empty()) {
                err(drogon::k400BadRequest,
                    "Invalid parent");
                return;
            }
            auto pp =
                r[0]["path"].as<std::string>();
            int depth =
                r[0]["depth"].as<int>() + 1;
            insertPageRow(
                c,
                {tenantId, parent, slug, title,
                 bodyMd, childPath(pp, slug),
                 depth, authorId},
                ok, err);
        } >>
        [err](
            const drogon::orm::DrogonDbException& e) {
            spdlog::error("wiki parent: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                "Failed to load parent");
        };
}

} // namespace services::wiki
