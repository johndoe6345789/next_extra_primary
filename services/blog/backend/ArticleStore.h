#pragma once

/**
 * @file ArticleStore.h
 * @brief Persistence facade for articles and article_revisions.
 *
 * Split across two .cpp files to stay under the 100 LOC limit:
 *  - article_store_read.cpp   : list / get / revisions
 *  - article_store_write.cpp  : create / update / publish
 */

#include "BlogTypes.h"

#include <memory>
#include <optional>
#include <vector>

namespace drogon::orm { class DbClient; }

namespace nextra::blog
{

/// Filter passed to @ref ArticleStore::list.
struct ListFilter
{
    std::optional<ArticleStatus> status;
    std::optional<std::string>   tag;
    int                          limit{50};
    int                          offset{0};
};

/**
 * @class ArticleStore
 * @brief Thin wrapper over Drogon's DbClient.
 */
class ArticleStore
{
public:
    explicit ArticleStore(
        std::shared_ptr<drogon::orm::DbClient> db);

    std::vector<Article> list(const ListFilter& f) const;
    int count(const ListFilter& f) const;
    std::optional<Article> getById(std::int64_t id) const;
    std::optional<Article> getBySlug(
        const std::string& slug) const;

    /// Insert a draft.  Returns the new row id.
    std::int64_t create(const Article& a);

    /// Patch mutable fields; writes an article_revisions row.
    bool update(std::int64_t id, const Article& patch);

    /// Delete (hard) — used by tests and admin tools.
    bool remove(std::int64_t id);

    /// Flip every scheduled row whose scheduled_at<=now to
    /// published.  Returns the number of rows updated.
    int publishDue();

    std::vector<Article> revisions(std::int64_t id) const;

private:
    std::shared_ptr<drogon::orm::DbClient> db_;
};

}  // namespace nextra::blog
