#pragma once
/**
 * @file CommentTree.h
 * @brief Builds a nested JSON tree from flat
 *        CommentRow records ordered by ltree
 *        materialized path.
 */

#include "CommentTypes.h"
#include <vector>

namespace services::comments
{

/**
 * @brief Nested tree builder.
 *
 * The input rows must be ordered by `path`
 * ascending (which the read-side store does).
 * Each row's `path` is a dot-separated ltree
 * value like "1.5.42"; children hang under the
 * parent whose path is the current row's path
 * with the last segment dropped.
 */
class CommentTree
{
  public:
    /**
     * @brief Build a nested JSON array of
     *        comments from flat rows.
     * @param rows Flat rows from CommentStore.
     * @return JSON array with "children" keys.
     */
    static json build(
        const std::vector<CommentRow>& rows);
};

} // namespace services::comments
