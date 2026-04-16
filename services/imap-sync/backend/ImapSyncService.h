#pragma once
/**
 * @file ImapSyncService.h
 * @brief IMAP mailbox sync service.
 *
 * Connects to a Dovecot IMAP server via mailio,
 * fetches new messages, and stores them in
 * the email_messages table.
 */

#include "imap-sync/backend/imap_sync_types.h"

#include <mailio/message.hpp>

#include <list>
#include <map>

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

    /**
     * @brief Persist fetched messages into Postgres.
     * @param fetched   Map of msgNo -> mailio message.
     * @param accountId Account UUID.
     * @param results   All UID results from search.
     * @return Number of new rows inserted.
     */
    int storeMessages(
        const std::map<unsigned long,
                       mailio::message>& fetched,
        const std::string& accountId,
        const std::list<unsigned long>& results);
};

} // namespace services
