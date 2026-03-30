/**
 * @file token_refresh_service.cpp
 * @brief Access-token refresh using a valid refresh JWT.
 */

#include "services/token_refresh_service.h"
#include "services/auth_helpers.h"
#include "utils/JwtUtil.h"

#include <drogon/drogon.h>
#include <drogon/orm/DbClient.h>
#include <spdlog/spdlog.h>

#include <string>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

void TokenRefreshService::refreshAccessToken(
    const std::string& refreshToken,
    Callback onSuccess, ErrCallback onError)
{
    try {
        auto claims = ::utils::verifyToken(refreshToken);
        if (!claims.isRefresh) {
            onError(k401Unauthorized, "Invalid token");
            return;
        }

        auto dbClient = authDb();
        const std::string sql = R"(
            SELECT 1 FROM token_blocklist
            WHERE jti = $1  LIMIT 1
        )";

        *dbClient << sql << refreshToken >>
            [onSuccess, onError, claims](
                const Result& result) {
                if (!result.empty()) {
                    onError(k401Unauthorized,
                            "Token has been revoked");
                    return;
                }
                auto dbInner =
                    drogon::app().getDbClient();
                const std::string roleSql = R"(
                    SELECT role FROM users
                    WHERE id = $1
                )";

                *dbInner << roleSql << claims.userId >>
                    [onSuccess, onError, claims](
                        const Result& r2) {
                        std::string role = "user";
                        if (!r2.empty()) {
                            role = r2[0]["role"]
                                       .as<std::string>();
                        }
                        auto tok =
                            ::utils::generateAccessToken(
                                claims.userId, role);
                        onSuccess(
                            {{"accessToken", tok}});
                    } >>
                    [onError](const DrogonDbException& e) {
                        spdlog::error(
                            "refreshAccessToken DB "
                            "error: {}",
                            e.base().what());
                        onError(k500InternalServerError,
                                "Internal server error");
                    };
            } >>
            [onError](const DrogonDbException& e) {
                spdlog::error(
                    "refreshAccessToken blocklist "
                    "check error: {}",
                    e.base().what());
                onError(k500InternalServerError,
                        "Internal server error");
            };
    } catch (const std::exception&) {
        onError(k401Unauthorized, "Invalid token");
    }
}

} // namespace services
