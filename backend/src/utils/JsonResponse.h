#pragma once
/**
 * @file JsonResponse.h
 * @brief Header-only helpers for building JSON HTTP responses.
 */

#include <drogon/HttpResponse.h>
#include <nlohmann/json.hpp>
#include <cstdint>
#include <string>

namespace utils {

using json = nlohmann::json;
using HttpResponsePtr = drogon::HttpResponsePtr;

/**
 * @brief Build a 200 OK JSON response.
 * @param data  Payload to send.
 * @return Ready-to-send HTTP response.
 */
inline auto jsonOk(const json &data) -> HttpResponsePtr
{
    auto resp = drogon::HttpResponse::newHttpResponse();
    resp->setStatusCode(drogon::k200OK);
    resp->setContentTypeCode(drogon::CT_APPLICATION_JSON);
    resp->setBody(data.dump());
    return resp;
}

/**
 * @brief Build a 201 Created JSON response.
 * @param data  Payload to send.
 * @return Ready-to-send HTTP response.
 */
inline auto jsonCreated(const json &data) -> HttpResponsePtr
{
    auto resp = drogon::HttpResponse::newHttpResponse();
    resp->setStatusCode(drogon::k201Created);
    resp->setContentTypeCode(drogon::CT_APPLICATION_JSON);
    resp->setBody(data.dump());
    return resp;
}

/**
 * @brief Build an error JSON response.
 * @param status  HTTP status code.
 * @param message Human-readable error message.
 * @return Ready-to-send HTTP response.
 */
inline auto jsonError(
    drogon::HttpStatusCode status,
    const std::string &message) -> HttpResponsePtr
{
    json body = {{"error", message}};
    auto resp = drogon::HttpResponse::newHttpResponse();
    resp->setStatusCode(status);
    resp->setContentTypeCode(drogon::CT_APPLICATION_JSON);
    resp->setBody(body.dump());
    return resp;
}

/**
 * @brief Build a paginated JSON response.
 * @param data    Array of items for the current page.
 * @param total   Total number of items across all pages.
 * @param page    Current page number (1-based).
 * @param perPage Number of items per page.
 * @return Ready-to-send HTTP response.
 */
inline auto jsonPaginated(
    const json &data,
    std::int64_t total,
    std::int64_t page,
    std::int64_t perPage) -> HttpResponsePtr
{
    json body = {
        {"data", data},
        {"pagination", {
            {"total", total},
            {"page", page},
            {"per_page", perPage},
            {"total_pages", (total + perPage - 1) / perPage}
        }}
    };
    auto resp = drogon::HttpResponse::newHttpResponse();
    resp->setStatusCode(drogon::k200OK);
    resp->setContentTypeCode(drogon::CT_APPLICATION_JSON);
    resp->setBody(body.dump());
    return resp;
}

}  // namespace utils
