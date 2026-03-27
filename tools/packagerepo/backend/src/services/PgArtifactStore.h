/**
 * @file PgArtifactStore.h
 * @brief PostgreSQL-backed artifact metadata store.
 */

#pragma once

#include "DbPool.h"

#include <json/json.h>

#include <string>
#include <vector>

namespace repo
{

class PgArtifactStore
{
public:
    /// @brief Publish artifact. Returns false if exists.
    static bool publish(int repoType,
                        const std::string& ns,
                        const std::string& name,
                        const std::string& version,
                        const std::string& variant,
                        const std::string& digest,
                        int64_t size,
                        const std::string& createdBy)
    {
        try {
            DbPool::get()->execSqlSync(
                "INSERT INTO artifacts "
                "(repo_type,namespace,name,version,"
                "variant,blob_digest,blob_size,created_by) "
                "VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
                repoType, ns, name, version, variant,
                digest, size, createdBy);
            return true;
        } catch (...) {
            return false; // unique violation
        }
    }

    /// @brief Get artifact metadata by coordinates.
    static Json::Value get(int repoType,
                           const std::string& ns,
                           const std::string& name,
                           const std::string& version,
                           const std::string& variant)
    {
        auto r = DbPool::get()->execSqlSync(
            "SELECT * FROM artifacts WHERE repo_type=$1 "
            "AND namespace=$2 AND name=$3 "
            "AND version=$4 AND variant=$5",
            repoType, ns, name, version, variant);
        if (r.empty()) return Json::nullValue;
        return rowToJson(r[0]);
    }

    /// @brief List versions sorted descending.
    static std::vector<Json::Value>
    versions(int repoType, const std::string& ns,
             const std::string& name, int limit = 100)
    {
        auto r = DbPool::get()->execSqlSync(
            "SELECT * FROM artifacts WHERE repo_type=$1 "
            "AND namespace=$2 AND name=$3 "
            "ORDER BY version DESC LIMIT "
            + std::to_string(limit),
            repoType, ns, name);
        std::vector<Json::Value> out;
        for (const auto& row : r)
            out.push_back(rowToJson(row));
        return out;
    }

    /// @brief Get latest version (first by desc sort).
    static Json::Value latest(int repoType,
                              const std::string& ns,
                              const std::string& name)
    {
        auto v = versions(repoType, ns, name, 1);
        return v.empty() ? Json::nullValue : v[0];
    }

    /// @brief List distinct packages with latest version.
    static std::vector<Json::Value> list(int repoType,
                                         int limit = 200)
    {
        auto r = DbPool::get()->execSqlSync(
            "SELECT DISTINCT ON (namespace, name) "
            "namespace, name, version, variant, "
            "blob_digest, blob_size, created_at "
            "FROM artifacts WHERE repo_type=$1 "
            "ORDER BY namespace, name, created_at DESC "
            "LIMIT " + std::to_string(limit),
            repoType);
        std::vector<Json::Value> out;
        for (const auto& row : r)
            out.push_back(rowToJson(row));
        return out;
    }

    /// @brief Count total artifacts.
    static int64_t count()
    {
        auto r = DbPool::get()->execSqlSync(
            "SELECT count(*) AS c FROM artifacts");
        return r[0]["c"].as<int64_t>();
    }

private:
    static Json::Value rowToJson(
        const drogon::orm::Row& row)
    {
        Json::Value j;
        j["namespace"] = row["namespace"].as<std::string>();
        j["name"] = row["name"].as<std::string>();
        j["version"] = row["version"].as<std::string>();
        j["variant"] = row["variant"].as<std::string>();
        j["blob_digest"] =
            row["blob_digest"].as<std::string>();
        j["blob_size"] = (Json::Int64)
            row["blob_size"].as<int64_t>();
        return j;
    }
};

} // namespace repo
