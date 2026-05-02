#pragma once
/**
 * @file alert_controller_helpers.h
 * @brief Shared helpers for AlertController endpoints.
 */

#include <drogon/HttpResponse.h>
#include <string>

namespace controllers::alert_helpers
{

/// Whitelist of permitted severity strings.
inline bool validSeverity(const std::string& s)
{
    return s == "info" || s == "warning"
        || s == "error" || s == "critical";
}

/// Map service-layer error code to HTTP status.
inline drogon::HttpStatusCode mapStatus(int c)
{
    if (c == 404) return drogon::k404NotFound;
    if (c == 400) return drogon::k400BadRequest;
    return drogon::k500InternalServerError;
}

} // namespace controllers::alert_helpers
