/**
 * @file PgAdapterStore.cpp
 * @brief Protocol adapter PostgreSQL queries.
 */

#include "PgAdapterStore.h"

namespace repo
{

std::vector<AdapterInfo> PgAdapterStore::loadAll(int repoType)
{
    auto rows = DbPool::get()->execSqlSync(
        "SELECT id, repo_type, name, prefix, namespace, "
        "content_type, tarball_ext, meta_format "
        "FROM protocol_adapters "
        "WHERE repo_type=$1 AND enabled=true "
        "ORDER BY name",
        repoType);

    std::vector<AdapterInfo> out;
    out.reserve(rows.size());
    for (const auto& r : rows) {
        AdapterInfo a;
        a.id = r["id"].as<int>();
        a.repoType = r["repo_type"].as<int>();
        a.name = r["name"].as<std::string>();
        a.prefix = r["prefix"].as<std::string>();
        a.ns = r["namespace"].as<std::string>();
        a.contentType = r["content_type"].as<std::string>();
        a.tarballExt = r["tarball_ext"].as<std::string>();
        a.metaFormat = r["meta_format"].as<std::string>();
        out.push_back(std::move(a));
    }
    return out;
}

const AdapterInfo* PgAdapterStore::findByName(
    const std::vector<AdapterInfo>& adapters,
    const std::string& name)
{
    for (const auto& a : adapters) {
        if (a.name == name)
            return &a;
    }
    return nullptr;
}

} // namespace repo
