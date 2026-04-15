/**
 * @file migration_topo_sort.cpp
 * @brief Kahn's algorithm over DomainGraph.
 */

#include "migration-runner/backend/migration_topo_sort.h"

#include <spdlog/spdlog.h>

#include <map>
#include <queue>
#include <set>
#include <stdexcept>

namespace services::migrations
{

std::vector<std::string> topoSortDomains(const DomainGraph& graph)
{
    std::map<std::string, int> indeg;
    std::map<std::string, std::vector<std::string>> fwd;
    for (const auto& [d, _] : graph) {
        indeg[d] = 0;
        fwd[d] = {};
    }
    for (const auto& [d, deps] : graph) {
        for (const auto& dep : deps) {
            if (!graph.count(dep)) {
                throw std::runtime_error(
                    "Unknown dep '" + dep + "' in domain '" + d + "'");
            }
            fwd[dep].push_back(d);
            indeg[d]++;
        }
    }
    std::queue<std::string> q;
    for (const auto& [d, n] : indeg) {
        if (n == 0) {
            q.push(d);
        }
    }
    std::vector<std::string> out;
    while (!q.empty()) {
        auto cur = q.front();
        q.pop();
        out.push_back(cur);
        for (const auto& next : fwd[cur]) {
            if (--indeg[next] == 0) {
                q.push(next);
            }
        }
    }
    if (out.size() != graph.size()) {
        throw std::runtime_error("Migration graph has a cycle");
    }
    return out;
}

} // namespace services::migrations
