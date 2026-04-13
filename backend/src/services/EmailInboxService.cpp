/// @file EmailInboxService.cpp -- Message queries.
#include "services/EmailInboxService.h"

#include <drogon/orm/DbClient.h>
#include <spdlog/spdlog.h>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

void EmailInboxService::listMessages(
    const std::string& accountId,
    const std::string& folder,
    int page, int pageSize,
    SyncCb onSuccess, SyncErrCb onError)
{
    auto db = drogon::app().getDbClient();
    int offset = (page - 1) * pageSize;

    const std::string sql = R"(
        SELECT id, uid, folder, subject,
               from_addr, to_addrs, body_text,
               is_read, is_starred,
               date_sent, date_recv
        FROM email_messages
        WHERE account_id = $1::uuid
          AND folder = $2
        ORDER BY date_recv DESC
        LIMIT $3::int OFFSET $4::int
    )";

    *db << sql << accountId << folder
        << pageSize << offset
        >> [onSuccess](const Result& r) {
        json messages = json::array();
        for (const auto& row : r) {
            messages.push_back({
                {"id", row["id"]
                     .as<std::string>()},
                {"uid", row["uid"].as<int>()},
                {"folder", row["folder"]
                     .as<std::string>()},
                {"subject", row["subject"]
                     .as<std::string>()},
                {"from", row["from_addr"]
                     .as<std::string>()},
                {"to", row["to_addrs"]
                     .as<std::string>()},
                {"preview",
                 row["body_text"]
                     .as<std::string>()
                     .substr(0, 120)},
                {"isRead",
                 row["is_read"].as<bool>()},
                {"isStarred",
                 row["is_starred"].as<bool>()},
                {"receivedAt",
                 row["date_recv"]
                     .as<std::string>()},
            });
        }
        onSuccess({{"messages", messages}});
    }
        >> [onError](const DrogonDbException& e) {
        spdlog::error("listMessages: {}",
                      e.base().what());
        onError(k500InternalServerError,
                "Database error");
    };
}

void EmailInboxService::getMessage(
    const std::string& messageId,
    SyncCb onSuccess, SyncErrCb onError)
{
    auto db = drogon::app().getDbClient();
    const std::string sql = R"(
        SELECT * FROM email_messages
        WHERE id = $1::uuid
    )";

    *db << sql << messageId
        >> [onSuccess, onError](const Result& r) {
        if (r.empty()) {
            onError(k404NotFound,
                    "Message not found");
            return;
        }
        auto row = r[0];
        onSuccess({
            {"id", row["id"]
                 .as<std::string>()},
            {"subject", row["subject"]
                 .as<std::string>()},
            {"from", row["from_addr"]
                 .as<std::string>()},
            {"to", row["to_addrs"]
                 .as<std::string>()},
            {"bodyText", row["body_text"]
                 .as<std::string>()},
            {"isRead",
             row["is_read"].as<bool>()},
            {"isStarred",
             row["is_starred"].as<bool>()},
            {"receivedAt", row["date_recv"]
                 .as<std::string>()},
        });
    }
        >> [onError](const DrogonDbException& e) {
        spdlog::error("getMessage: {}",
                      e.base().what());
        onError(k500InternalServerError,
                "Database error");
    };
}

} // namespace services
