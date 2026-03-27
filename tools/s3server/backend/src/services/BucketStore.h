/**
 * @file BucketStore.h
 * @brief PostgreSQL-backed bucket metadata store.
 */

#pragma once

#include "DbPool.h"

#include <json/json.h>

#include <string>
#include <vector>

namespace s3
{

/// @brief CRUD operations for S3 buckets.
class BucketStore
{
public:
    /// @brief Create a bucket. Returns false if exists.
    static bool create(const std::string& name,
                       const std::string& region)
    {
        try {
            DbPool::get()->execSqlSync(
                "INSERT INTO buckets (name, region) "
                "VALUES ($1, $2)",
                name, region);
            return true;
        } catch (...) {
            return false;
        }
    }

    /// @brief Get bucket by name.
    static Json::Value get(const std::string& name)
    {
        auto r = DbPool::get()->execSqlSync(
            "SELECT * FROM buckets WHERE name=$1",
            name);
        if (r.empty()) return Json::nullValue;
        return rowToJson(r[0]);
    }

    /// @brief List all buckets.
    static std::vector<Json::Value> list()
    {
        auto r = DbPool::get()->execSqlSync(
            "SELECT * FROM buckets ORDER BY name");
        std::vector<Json::Value> out;
        for (const auto& row : r)
            out.push_back(rowToJson(row));
        return out;
    }

    /// @brief Delete bucket (cascade deletes objects).
    static bool remove(const std::string& name)
    {
        auto r = DbPool::get()->execSqlSync(
            "DELETE FROM buckets WHERE name=$1 "
            "RETURNING id", name);
        return !r.empty();
    }

    /// @brief Get bucket ID by name (0 if not found).
    static int getId(const std::string& name)
    {
        auto r = DbPool::get()->execSqlSync(
            "SELECT id FROM buckets WHERE name=$1",
            name);
        if (r.empty()) return 0;
        return r[0]["id"].as<int>();
    }

private:
    static Json::Value rowToJson(
        const drogon::orm::Row& row)
    {
        Json::Value j;
        j["name"] = row["name"].as<std::string>();
        j["region"] = row["region"].as<std::string>();
        j["created_at"] =
            row["created_at"].as<std::string>();
        return j;
    }
};

} // namespace s3
