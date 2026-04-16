/// @file imap_sync_fetch.cpp -- Blocking IMAP fetch.
#include "imap-sync/backend/ImapSyncService.h"

#include <mailio/codec.hpp>
#include <mailio/imap.hpp>
#include <spdlog/spdlog.h>

#include <list>
#include <map>

namespace services
{

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
    conditions.emplace_back(search_cond::ALL);
    std::list<unsigned long> results;
    conn.search(conditions, results);

    std::list<range_t> ranges;
    for (auto msgNo : results) {
        if (static_cast<int>(msgNo) > lastUid)
            ranges.push_back({msgNo, msgNo});
    }
    if (ranges.empty())
        return {{"newMessages", 0}};

    std::map<unsigned long, mailio::message>
        fetched;
    conn.fetch(ranges, fetched, false, false,
        mailio::codec::line_len_policy_t::NONE);

    int newCount =
        storeMessages(fetched, accountId, results);

    spdlog::info(
        "IMAP synced {} new msgs for {}",
        newCount, accountId);
    return {{"newMessages", newCount}};
}

} // namespace services
