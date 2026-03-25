/**
 * @file MigrationService.cpp
 * @brief MigrationService facade implementation.
 *
 * Delegates each operation to the appropriate sub-module.
 */

#include "services/MigrationService.h"
#include "services/MigrationRollback.h"
#include "services/MigrationRunner.h"
#include "services/MigrationStateStore.h"
#include "services/MigrationStatusQuery.h"

namespace services
{

MigrationService::MigrationService(std::string migrationsDir)
    : migrationsDir_(std::move(migrationsDir))
{
}

void MigrationService::runMigrations(
    Callback onSuccess, ErrCallback onError)
{
    MigrationRunner runner(migrationsDir_);
    runner.runMigrations(onSuccess, onError);
}

void MigrationService::rollbackLast(
    Callback onSuccess, ErrCallback onError)
{
    MigrationStateStore::ensureTable(
        [this, onSuccess, onError]() {
            MigrationRollback::rollbackLast(
                migrationsDir_, onSuccess, onError);
        },
        onError);
}

void MigrationService::getMigrationStatus(
    Callback onSuccess, ErrCallback onError)
{
    MigrationStateStore::ensureTable(
        [this, onSuccess, onError]() {
            MigrationStatusQuery::getStatus(
                migrationsDir_, onSuccess, onError);
        },
        onError);
}

} // namespace services
