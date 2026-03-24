#pragma once
/**
 * @file MigrationService.h
 * @brief SQL database migration runner.
 *
 * Reads `.sql` files from a `migrations/` directory, tracks
 * applied migrations in a `schema_migrations` table, and
 * executes each within a transaction.  Files are sorted by
 * their numeric prefix (001_, 002_, ...).
 */

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>

#include <functional>
#include <string>
#include <vector>

namespace services
{

using json = nlohmann::json;
using DbClientPtr = drogon::orm::DbClientPtr;
using Callback = std::function<void(json)>;
using ErrCallback = std::function<void(drogon::HttpStatusCode, std::string)>;

/**
 * @brief Status of one migration file.
 */
struct MigrationStatus {
    std::string filename;
    std::string appliedAt; ///< ISO timestamp or empty.
    bool pending{true};
};

/**
 * @class MigrationService
 * @brief Applies and rolls back SQL migration files.
 */
class MigrationService
{
  public:
    /**
     * @brief Construct with a custom migrations directory.
     *
     * @param migrationsDir Filesystem path to the folder
     *                      containing `.sql` files.
     *                      Defaults to `"migrations"`.
     */
    explicit MigrationService(std::string migrationsDir = "migrations");
    ~MigrationService() = default;

    // -------------------------------------------------------
    // Core operations
    // -------------------------------------------------------

    /**
     * @brief Apply all pending migrations in order.
     *
     * Each migration is executed inside its own transaction.
     * On the first run the `schema_migrations` table is
     * auto-created.
     *
     * @param onSuccess Callback with an array of applied
     *                  filenames.
     * @param onError   Callback on failure (partial apply
     *                  is possible if a later migration
     *                  fails).
     */
    void runMigrations(Callback onSuccess, ErrCallback onError);

    /**
     * @brief Roll back the most recently applied migration.
     *
     * Looks for a `-- DOWN` section in the migration file
     * to obtain the rollback SQL.
     *
     * @param onSuccess Callback with `{filename}`.
     * @param onError   Callback on failure.
     */
    void rollbackLast(Callback onSuccess, ErrCallback onError);

    /**
     * @brief Get the status of every known migration.
     *
     * @param onSuccess Callback with a status array.
     * @param onError   Callback on failure.
     */
    void getMigrationStatus(Callback onSuccess, ErrCallback onError);

  private:
    /// Convenience DB accessor.
    [[nodiscard]] static auto db() -> DbClientPtr;

    /// Ensure the schema_migrations table exists.
    void ensureTable(std::function<void()> then, ErrCallback onError);

    /// List .sql files sorted by prefix.
    [[nodiscard]] auto discoverFiles() const -> std::vector<std::string>;

    /// Read the full contents of a file.
    [[nodiscard]] static auto readFile(const std::string& path) -> std::string;

    /// Extract the UP portion of a migration file
    /// (everything before `-- DOWN`).
    [[nodiscard]] static auto extractUp(const std::string& sql) -> std::string;

    /// Extract the DOWN portion (after `-- DOWN`).
    [[nodiscard]] static auto extractDown(const std::string& sql)
        -> std::string;

    std::string migrationsDir_;
};

} // namespace services
