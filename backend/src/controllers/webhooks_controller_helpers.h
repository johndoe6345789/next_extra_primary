#pragma once

/**
 * @file webhooks_controller_helpers.h
 * @brief Small helpers shared across the webhooks controller
 *        translation units.
 */

#include <drogon/HttpResponse.h>
#include <json/json.h>

#include <string>

namespace nextra::webhooks
{

/// @brief Build a 400 JSON error response.
inline drogon::HttpResponsePtr webhooksBadReq(const std::string& msg)
{
    auto r = drogon::HttpResponse::newHttpResponse();
    r->setStatusCode(drogon::k400BadRequest);
    r->setContentTypeCode(drogon::CT_APPLICATION_JSON);
    r->setBody("{\"error\":\"" + msg + "\"}");
    return r;
}

/// @brief Convert a JSON array of strings to a Postgres text[] literal.
inline std::string webhooksEventsArray(const Json::Value& arr)
{
    std::string out = "{";
    for (Json::ArrayIndex i = 0; i < arr.size(); ++i)
    {
        if (i) out += ",";
        out += "\"" + arr[i].asString() + "\"";
    }
    out += "}";
    return out;
}

}  // namespace nextra::webhooks
