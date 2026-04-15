/**
 * @file CommentTree.cpp
 * @brief Flat ltree rows -> nested JSON tree.
 */

#include "CommentTree.h"
#include <unordered_map>

namespace services::comments
{

/** @brief Drop the last dotted segment. */
static std::string parentPath(
    const std::string& path)
{
    const auto pos = path.find_last_of('.');
    if (pos == std::string::npos)
        return std::string{};
    return path.substr(0, pos);
}

json CommentTree::build(
    const std::vector<CommentRow>& rows)
{
    std::unordered_map<std::string, json*> byPath;
    json roots = json::array();

    for (const auto& r : rows) {
        json node = r.toJson();
        node["children"] = json::array();
        const auto parent = parentPath(r.path);

        auto it = byPath.find(parent);
        if (parent.empty() || it == byPath.end()) {
            roots.push_back(std::move(node));
            byPath[r.path] =
                &roots.back();
        } else {
            auto& kids = (*it->second)["children"];
            kids.push_back(std::move(node));
            byPath[r.path] = &kids.back();
        }
    }
    return roots;
}

} // namespace services::comments
