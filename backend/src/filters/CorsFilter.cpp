/**
 * @file CorsFilter.cpp
 * @brief CORS header injection and preflight handling.
 */

#include "CorsFilter.h"

#include <drogon/drogon.h>
#include <string>
#include <vector>

namespace filters
{

namespace
{

auto getAllowedOrigin(const std::string& requestOrigin) -> std::string
{
    auto& cfg = drogon::app().getCustomConfig();
    if (cfg.isMember("cors_origins") && cfg["cors_origins"].isArray()) {
        for (const auto& o : cfg["cors_origins"]) {
            if (o.asString() == requestOrigin) {
                return requestOrigin;
            }
        }
        return {}; // Origin not in allowlist.
    }
    // No config -> echo request origin (dev mode).
    // Returning "*" with credentials is invalid per
    // the CORS spec, so we reflect the origin instead.
    return requestOrigin;
}

void setCorsHeaders(const drogon::HttpResponsePtr& resp,
                    const std::string& origin)
{
    resp->addHeader("Access-Control-Allow-Origin", origin);
    resp->addHeader("Access-Control-Allow-Methods",
                    "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    resp->addHeader("Access-Control-Allow-Headers",
                    "Content-Type, Authorization");
    resp->addHeader("Access-Control-Allow-Credentials", "true");
    resp->addHeader("Access-Control-Max-Age", "86400");
}

} // namespace

void CorsFilter::doFilter(const drogon::HttpRequestPtr& req,
                          drogon::FilterCallback&& cb,
                          drogon::FilterChainCallback&& ccb)
{
    auto origin = req->getHeader("Origin");
    auto allowed = getAllowedOrigin(origin);

    if (allowed.empty()) {
        // Origin not allowed; continue without headers.
        ccb();
        return;
    }

    if (req->method() == drogon::Options) {
        auto resp = drogon::HttpResponse::newHttpResponse();
        resp->setStatusCode(drogon::k204NoContent);
        setCorsHeaders(resp, allowed);
        cb(resp);
        return;
    }

    // Non-preflight: wrap the callback to inject CORS
    // headers on the actual response.
    auto wrappedCb = [cb = std::move(cb),
                      allowed](const drogon::HttpResponsePtr& resp) {
        setCorsHeaders(resp, allowed);
        cb(resp);
    };

    ccb(std::move(wrappedCb));
}

} // namespace filters
