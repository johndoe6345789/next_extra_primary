/// @file EmailAccountServiceCreate.cpp -- Account creation.
#include "email/backend/EmailAccountService.h"

#include <drogon/orm/DbClient.h>
#include <spdlog/spdlog.h>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

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
