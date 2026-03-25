#pragma once
/**
 * @file MigrationRunner.h
 * @brief Orchestrates forward migration execution.
 *
 * Ensures the tracking table exists, fetches already-applied
 * filenames, computes the pending set, and delegates sequential
 * application to MigrationApplier.
 */

#include "services/MigrationStateStore.h"

#include <string>

namespace services
{

/**
 * @class MigrationRunner
 * @brief Applies all pending SQL migrations in order.
 */
class MigrationRunner
{
  public:
    /**
     * @brief Construct with the migrations directory path.
     *
     * @param migrationsDir Filesystem path to the folder
     *                      containing `.sql` files.
     */
    explicit MigrationRunner(std::string migrationsDir);

    /**
     * @brief Apply all pending migrations in ascending order.
     *
     * Each migration runs in its own transaction.  If a later
     * migration fails, previously applied ones remain committed.
     *
     * @param onSuccess Callback with a JSON array of applied
     *                  filenames.
     * @param onError   Callback on failure.
     */
    void runMigrations(Callback onSuccess, ErrCallback onError);

  private:
    std::string migrationsDir_;
};

} // namespace services
