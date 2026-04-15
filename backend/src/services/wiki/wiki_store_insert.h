#pragma once
/**
 * @file wiki_store_insert.h
 * @brief Internal helpers for the write path of
 *        WikiStore — kept private to the service.
 */

#include "WikiTypes.h"

namespace services::wiki
{

/** @brief Arguments bundle for insertPageRow. */
struct InsertArgs
{
    std::string tenantId;
    std::optional<std::int64_t> parent;
    std::string slug;
    std::string title;
    std::string bodyMd;
    std::string path;
    int depth{0};
    std::string authorId;
};

/**
 * @brief Insert a wiki_pages row, selecting
 *        between the root and child SQL variants.
 * @param c      Drogon DB client.
 * @param a      Bundled insert arguments.
 * @param ok     Success callback.
 * @param err    Error callback.
 */
void insertPageRow(
    const drogon::orm::DbClientPtr& c,
    const InsertArgs& a,
    Callback ok, ErrCallback err);

} // namespace services::wiki
