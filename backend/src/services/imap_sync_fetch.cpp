/// @file imap_sync_fetch.cpp -- Blocking IMAP fetch.
#include "services/ImapSyncService.h"

#include <drogon/drogon.h>
#include <drogon/orm/DbClient.h>
#include <mailio/codec.hpp>
#include <mailio/imap.hpp>
#include <spdlog/spdlog.h>

#include <list>
#include <map>
#include <sstream>

namespace services
{

using namespace drogon::orm;
using search_cond =
    mailio::imap::search_condition_t;
using range_t =
    mailio::imap::messages_range_t;

auto ImapSyncService::fetchFromImap(
    const ImapConfig& cfg,
    const std::string& accountId,
    int lastUid) -> json
{
    mailio::imap conn(cfg.host, cfg.port);
    conn.authenticate(
        cfg.user, cfg.pass,
        mailio::imap::auth_method_t::LOGIN);

    conn.select("INBOX");

    std::list<search_cond> conditions;
    conditions.emplace_back(
        search_cond::ALL);
    std::list<unsigned long> results;
    conn.search(conditions, results);

    auto db = drogon::app().getDbClient();
    int newCount = 0;

    // Filter to new messages only
    std::list<range_t> ranges;
    for (auto msgNo : results) {
        if (static_cast<int>(msgNo)
            > lastUid) {
            ranges.push_back({msgNo, msgNo});
        }
    }

    if (ranges.empty()) {
        return {{"newMessages", 0}};
    }

    // Batch fetch with lenient line policy
    std::map<unsigned long, mailio::message>
        fetched;
    conn.fetch(ranges, fetched, false, false,
        mailio::codec::line_len_policy_t::NONE);

    for (auto& [msgNo, msg] : fetched) {
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
        if (!sender.addresses.empty()) {
            fromAddr =
                sender.addresses[0].address;
        }

        std::ostringstream tos;
        auto recips = msg.recipients();
        for (auto& a : recips.addresses) {
            if (!tos.str().empty())
                tos << ", ";
            tos << a.address;
        }

        db->execSqlSync(
            sql, accountId,
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

    spdlog::info(
        "IMAP synced {} new msgs for {}",
        newCount, accountId);
    return {{"newMessages", newCount}};
}

} // namespace services
