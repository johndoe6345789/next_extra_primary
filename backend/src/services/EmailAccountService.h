#pragma once
/**
 * @file EmailAccountService.h
 * @brief CRUD for email accounts (IMAP config).
 */

#include "services/imap_sync_types.h"

namespace services
{

/**
 * @class EmailAccountService
 * @brief Manages email account records.
 */
class EmailAccountService
{
  public:
    EmailAccountService() = default;

    /**
     * @brief List all accounts for a user.
     * @param userId    Owner user ID.
     * @param onSuccess Returns account array.
     * @param onError   Called on failure.
     */
    void listAccounts(
        const std::string& userId,
        SyncCb onSuccess,
        SyncErrCb onError);

    /**
     * @brief Create a new email account.
     * @param userId  Owner user ID.
     * @param data    Account configuration JSON.
     * @param onSuccess Returns created account.
     * @param onError   Called on failure.
     */
    void createAccount(
        const std::string& userId,
        const json& data,
        SyncCb onSuccess,
        SyncErrCb onError);
};

} // namespace services
