/// @file EmailAccountService.cpp -- Account listing.
#include "email/backend/EmailAccountService.h"

#include <drogon/orm/DbClient.h>
#include <spdlog/spdlog.h>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

void EmailAccountService::listAccounts(
    const std::string& userId,
    SyncCb onSuccess, SyncErrCb onError)
{
    auto db = drogon::app().getDbClient();
    const std::string sql = R"(
        SELECT id, account_name, email_address,
               imap_host, imap_port,
               last_sync_at, sync_status
        FROM email_accounts
        WHERE user_id = $1::uuid
        ORDER BY created_at
    )";

    *db << sql << userId
        >> [onSuccess](const Result& r) {
        json accounts = json::array();
        for (const auto& row : r) {
            accounts.push_back({
                {"id",
                 row["id"].as<std::string>()},
                {"accountName",
                 row["account_name"]
                     .as<std::string>()},
                {"emailAddress",
                 row["email_address"]
                     .as<std::string>()},
                {"imapHost",
                 row["imap_host"]
                     .as<std::string>()},
                {"syncStatus",
                 row["sync_status"]
                     .as<std::string>()},
            });
        }
        onSuccess({{"accounts", accounts}});
    }
        >> [onError](const DrogonDbException& e) {
        spdlog::error("listAccounts: {}",
                      e.base().what());
        onError(k500InternalServerError,
                "Database error");
    };
}

} // namespace services
