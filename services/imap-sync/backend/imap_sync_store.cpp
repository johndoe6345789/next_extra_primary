/// @file imap_sync_store.cpp -- Persist fetched messages.
#include "imap-sync/backend/ImapSyncService.h"

#include <drogon/drogon.h>
#include <drogon/orm/DbClient.h>
#include <mailio/imap.hpp>
#include <spdlog/spdlog.h>

#include <map>
#include <sstream>

namespace services
{

using namespace drogon::orm;

int ImapSyncService::storeMessages(
    const std::map<unsigned long, mailio::message>&
        fetched,
    const std::string& accountId,
    const std::list<unsigned long>& results)
{
    auto db = drogon::app().getDbClient();
    int newCount = 0;

    for (const auto& [msgNo, msg] : fetched) {
        const std::string sql = R"(
            INSERT INTO email_messages
            (account_id, uid, folder, subject,
             from_addr, to_addrs, body_text,
             is_read, date_recv)
            VALUES ($1, $2, 'INBOX', $3,
                    $4, $5, $6, false, NOW())
            ON CONFLICT DO NOTHING
        )";
        auto sender = msg.from();
        std::string fromAddr;
        if (!sender.addresses.empty())
            fromAddr = sender.addresses[0].address;
        std::ostringstream tos;
        for (auto& a : msg.recipients().addresses) {
            if (!tos.str().empty()) tos << ", ";
            tos << a.address;
        }
        db->execSqlSync(sql, accountId,
            static_cast<int>(msgNo),
            msg.subject(), fromAddr,
            tos.str(), msg.content());
        ++newCount;
    }

    if (!results.empty()) {
        int maxUid =
            static_cast<int>(results.back());
        db->execSqlSync(
            "UPDATE email_accounts "
            "SET last_sync_uid = $1, "
            "last_sync_at = NOW(), "
            "sync_status = 'idle' "
            "WHERE id = $2",
            maxUid, accountId);
    }
    return newCount;
}

} // namespace services
