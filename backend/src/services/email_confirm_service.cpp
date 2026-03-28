/**
 * @file email_confirm_service.cpp
 * @brief Email confirmation via one-time token.
 */

#include "services/email_confirm_service.h"
#include "services/auth_helpers.h"

#include <drogon/drogon.h>
#include <drogon/orm/DbClient.h>
#include <spdlog/spdlog.h>

#include <string>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

void EmailConfirmService::confirmEmail(
    const std::string& token,
    Callback onSuccess, ErrCallback onError)
{
    auto dbClient = authDb();
    const std::string sql = R"(
        UPDATE users
        SET email_confirmed = true,
            email_confirm_token = NULL,
            updated_at = NOW()
        WHERE email_confirm_token = $1
          AND email_confirmed = false
        RETURNING id
    )";

    *dbClient << sql << token >>
        [onSuccess, onError](const Result& result) {
            if (result.empty()) {
                onError(k400BadRequest,
                        "Invalid or expired "
                        "confirmation token");
                return;
            }
            spdlog::info(
                "Email confirmed for user {}",
                result[0]["id"].as<std::string>());
            onSuccess({{"confirmed", true}});
        } >>
        [onError](const DrogonDbException& e) {
            spdlog::error(
                "confirmEmail DB error: {}",
                e.base().what());
            onError(k500InternalServerError,
                    "Internal server error");
        };
}

} // namespace services
