/**
 * @file WikiTree.cpp
 * @brief Implementation of flat->nested wiki tree.
 */

#include "WikiTree.h"
#include <cstdint>
#include <unordered_map>

namespace services::wiki
{

json buildTree(const json& flat)
{
    std::unordered_map<std::int64_t,
                       std::size_t>
        indexById;
    auto nodes = json::array();
    if (!flat.contains("pages")) {
        return {{"tree", json::array()}};
    }
    for (const auto& p : flat["pages"]) {
        auto node = p;
        node["children"] = json::array();
        indexById[p["id"]
                      .get<std::int64_t>()] =
            nodes.size();
        nodes.push_back(std::move(node));
    }
    auto tree = json::array();
    for (std::size_t i = 0; i < nodes.size(); ++i) {
        const auto& n = nodes[i];
        if (n["parentId"].is_null()) {
            continue;
        }
        auto pid =
            n["parentId"].get<std::int64_t>();
        auto it = indexById.find(pid);
        if (it == indexById.end()) continue;
        nodes[it->second]["children"]
            .push_back(n);
    }
    for (const auto& n : nodes) {
        if (n["parentId"].is_null()) {
            tree.push_back(n);
        }
    }
    return {{"tree", tree}};
}

} // namespace services::wiki
