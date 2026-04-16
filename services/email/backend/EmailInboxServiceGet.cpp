/// @file EmailInboxServiceGet.cpp -- Single message fetch.
#include "email/backend/EmailInboxService.h"

#include <drogon/orm/DbClient.h>
#include <spdlog/spdlog.h>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

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
