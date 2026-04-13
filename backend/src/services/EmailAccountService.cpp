/// @file EmailAccountService.cpp -- Account CRUD.
#include "services/EmailAccountService.h"

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

void EmailAccountService::createAccount(
    const std::string& userId,
    const json& data,
    SyncCb onSuccess, SyncErrCb onError)
{
    auto db = drogon::app().getDbClient();
    const std::string sql = R"(
        INSERT INTO email_accounts
        (user_id, account_name, email_address,
         imap_host, imap_port,
         imap_user, imap_pass)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, account_name,
                  email_address
    )";

    auto name = data.value("accountName", "");
    auto email = data.value("emailAddress", "");
    auto host = data.value("imapHost", "");
    auto port = data.value("imapPort", 143);
    auto user = data.value("imapUser", "");
    auto pass = data.value("imapPass", "");

    *db << sql << userId << name << email
        << host << port << user << pass
        >> [onSuccess](const Result& r) {
        auto row = r[0];
        onSuccess({
            {"id",
             row["id"].as<std::string>()},
            {"accountName",
             row["account_name"]
                 .as<std::string>()},
            {"emailAddress",
             row["email_address"]
                 .as<std::string>()},
        });
    }
        >> [onError](const DrogonDbException& e) {
        spdlog::error("createAccount: {}",
                      e.base().what());
        onError(k500InternalServerError,
                "Database error");
    };
}

} // namespace services
