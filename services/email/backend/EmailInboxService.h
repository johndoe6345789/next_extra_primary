#pragma once
/**
 * @file EmailInboxService.h
 * @brief Query email messages from the database.
 */

#include "imap-sync/backend/imap_sync_types.h"

namespace services
{

/**
 * @class EmailInboxService
 * @brief Lists and retrieves synced emails.
 */
class EmailInboxService
{
  public:
    EmailInboxService() = default;

    /**
     * @brief List messages for an account.
     * @param accountId  Email account UUID.
     * @param folder     IMAP folder name.
     * @param page       Page number (1-based).
     * @param pageSize   Messages per page.
     * @param onSuccess  Returns message array.
     * @param onError    Called on failure.
     */
    void listMessages(
        const std::string& accountId,
        const std::string& folder,
        int page, int pageSize,
        SyncCb onSuccess,
        SyncErrCb onError);

    /**
     * @brief Get a single message by ID.
     * @param messageId  Message UUID.
     * @param onSuccess  Returns message JSON.
     * @param onError    Called on failure.
     */
    void getMessage(
        const std::string& messageId,
        SyncCb onSuccess,
        SyncErrCb onError);
};

} // namespace services
