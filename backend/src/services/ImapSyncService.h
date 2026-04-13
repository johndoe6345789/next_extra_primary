#pragma once
/**
 * @file ImapSyncService.h
 * @brief IMAP mailbox sync service.
 *
 * Connects to a Dovecot IMAP server via mailio,
 * fetches new messages, and stores them in
 * the email_messages table.
 */

#include "services/imap_sync_types.h"

namespace services
{

/**
 * @class ImapSyncService
 * @brief Syncs an IMAP mailbox into Postgres.
 */
class ImapSyncService
{
  public:
    ImapSyncService() = default;

    /**
     * @brief Sync messages for an account.
     * @param accountId  UUID of the email_account.
     * @param onSuccess  Returns new message count.
     * @param onError    Called on failure.
     */
    void syncAccount(
        const std::string& accountId,
        SyncCb onSuccess,
        SyncErrCb onError);

  private:
    /**
     * @brief Blocking IMAP fetch (runs off-loop).
     * @param cfg       IMAP connection config.
     * @param accountId Account UUID.
     * @param lastUid   Last synced UID.
     * @return JSON with newMessages count.
     */
    [[nodiscard]] auto fetchFromImap(
        const ImapConfig& cfg,
        const std::string& accountId,
        int lastUid) -> json;
};

} // namespace services
