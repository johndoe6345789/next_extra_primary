#pragma once
/**
 * @file WikiTree.h
 * @brief Convert a flat list of pages (ordered by
 *        ltree path) into a nested tree JSON.
 */

#include <nlohmann/json.hpp>

namespace services::wiki
{

using json = nlohmann::json;

/**
 * @brief Nest a flat list of pages by parent_id.
 *
 * Input shape: {"pages": [{id,parentId,...}, ...]}
 * Output shape: {"tree": [{...page, children:[]}]}
 *
 * @param flat The flat listing returned by the
 *             store's listTree.
 * @return A new JSON object with a nested tree.
 */
json buildTree(const json& flat);

} // namespace services::wiki
