/**
 * @file PgAdapterStore.h
 * @brief Loads protocol adapter configs from PostgreSQL.
 *
 * Each adapter maps a URL prefix (e.g. /npm, /apt, /conan) to
 * relational columns that drive response formatting.
 */

#pragma once

#include "DbPool.h"

#include <string>
#include <vector>

namespace repo
{

/// @brief A single protocol adapter record.
struct AdapterInfo {
    int id = 0;
    int repoType = 0;
    std::string name;
    std::string prefix;
    std::string ns;
    std::string contentType;
    std::string tarballExt;
    std::string metaFormat;
};

/// @brief Load and cache protocol adapters from DB.
class PgAdapterStore
{
  public:
    /// @brief Load all enabled adapters for a repo type.
    static std::vector<AdapterInfo> loadAll(int repoType);

    /// @brief Find adapter by name (e.g. "npm").
    static const AdapterInfo* findByName(
        const std::vector<AdapterInfo>& adapters,
        const std::string& name);
};

} // namespace repo
