#pragma once
/**
 * @file WikiStore.h
 * @brief Data-access layer for wiki pages and
 *        revisions. Implemented in the read/write
 *        split .cpp files.
 */

#include "WikiTypes.h"

namespace services::wiki
{

/**
 * @brief SQL-facing store for wiki pages.
 *
 * Read paths: tree listing, single page fetch,
 * revision list, single revision fetch.
 * Write paths: create, update (bumps a revision),
 * delete (cascades via FK).
 */
class WikiStore
{
  public:
    /** @brief Fetch every page row for a tenant. */
    void listTree(const std::string& tenantId,
                  Callback ok, ErrCallback err);

    /** @brief Fetch a single page by id. */
    void getPage(std::int64_t id, Callback ok,
                 ErrCallback err);

    /** @brief Fetch revision list for a page. */
    void listRevisions(std::int64_t pageId,
                       Callback ok,
                       ErrCallback err);

    /** @brief Fetch a single revision. */
    void getRevision(std::int64_t pageId, int rev,
                     Callback ok, ErrCallback err);

    /** @brief Create a new page under a parent. */
    void createPage(const std::string& tenantId,
                    std::optional<std::int64_t> parent,
                    const std::string& slug,
                    const std::string& title,
                    const std::string& bodyMd,
                    const std::string& authorId,
                    Callback ok, ErrCallback err);

    /** @brief Update a page + write revision. */
    void updatePage(std::int64_t id,
                    const std::string& title,
                    const std::string& bodyMd,
                    const std::string& authorId,
                    Callback ok, ErrCallback err);

    /** @brief Delete a page (cascades children). */
    void deletePage(std::int64_t id, Callback ok,
                    ErrCallback err);

  private:
    static auto db()
    {
        return drogon::app().getDbClient();
    }
};

} // namespace services::wiki
