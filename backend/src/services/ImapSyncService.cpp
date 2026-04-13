/// @file ImapSyncService.cpp -- IMAP sync (account lookup + dispatch).
#include "services/ImapSyncService.h"

#include <drogon/orm/DbClient.h>
#include <spdlog/spdlog.h>

#include <thread>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

void ImapSyncService::syncAccount(
    const std::string& accountId,
    SyncCb onSuccess, SyncErrCb onError)
{
    auto db = drogon::app().getDbClient();
    const std::string sql = R"(
        SELECT imap_host, imap_port,
               imap_user, imap_pass,
               last_sync_uid
        FROM email_accounts WHERE id = $1::uuid
    )";

    *db << sql << accountId
        >> [this, accountId, onSuccess, onError](
               const Result& r) {
        if (r.empty()) {
            onError(k404NotFound,
                    "Account not found");
            return;
        }
        auto row = r[0];
        auto envCfg = imapConfigFromEnv();
        ImapConfig cfg{
            row["imap_host"].isNull()
                ? envCfg.host
                : row["imap_host"]
                      .as<std::string>(),
            row["imap_port"].isNull()
                ? envCfg.port
                : row["imap_port"].as<int>(),
            row["imap_user"].isNull()
                ? envCfg.user
                : row["imap_user"]
                      .as<std::string>(),
            row["imap_pass"].isNull()
                ? envCfg.pass
                : row["imap_pass"]
                      .as<std::string>(),
        };
        int lastUid =
            row["last_sync_uid"].as<int>();

        std::thread(
            [this, cfg, accountId,
             lastUid, onSuccess, onError]() {
            try {
                auto result = fetchFromImap(
                    cfg, accountId, lastUid);
                onSuccess(result);
            } catch (const std::exception& e) {
                spdlog::error(
                    "IMAP sync error: {}",
                    e.what());
                onError(k500InternalServerError,
                        e.what());
            }
        }).detach();
    }
        >> [onError](const DrogonDbException& e) {
        spdlog::error(
            "Sync DB error: {}", e.base().what());
        onError(k500InternalServerError,
                "Database error");
    };
}

} // namespace services
