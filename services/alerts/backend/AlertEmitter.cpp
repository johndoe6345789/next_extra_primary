/**
 * @file AlertEmitter.cpp
 * @brief Async POST to /api/alerts via drogon::HttpClient.
 */

#include "alerts/backend/AlertEmitter.h"

#include <drogon/drogon.h>
#include <spdlog/spdlog.h>

#include <cstdlib>
#include <format>

namespace nextra::alerts
{

namespace
{

std::string envOr(const char* k, const char* def)
{
    const char* v = std::getenv(k);
    return (v && *v) ? std::string(v)
                     : std::string(def);
}

} // namespace

AlertEmitter::AlertEmitter()
    : host_(envOr("ALERTS_HOST", "backend")),
      port_(static_cast<std::uint16_t>(std::stoi(
          envOr("ALERTS_PORT", "8080"))))
{
    auto base = std::format(
        "http://{}:{}", host_, port_);
    client_ = drogon::HttpClient::newHttpClient(
        base, drogon::app().getLoop());
    spdlog::info("AlertEmitter -> {}", base);
}

void AlertEmitter::emit(
    const std::string& source,
    const std::string& severity,
    const std::string& message,
    const std::string& dedupeKey,
    const nlohmann::json& metadata)
{
    nlohmann::json body = {
        {"source",     source},
        {"severity",   severity},
        {"message",    message},
        {"dedupe_key", dedupeKey},
        {"metadata",   metadata}
    };
    auto req = drogon::HttpRequest::newHttpRequest();
    req->setMethod(drogon::Post);
    req->setPath("/api/alerts");
    req->setContentTypeCode(
        drogon::CT_APPLICATION_JSON);
    req->setBody(body.dump());

    client_->sendRequest(
        req,
        [dedupeKey](drogon::ReqResult r,
                    const drogon::HttpResponsePtr& resp) {
            if (r != drogon::ReqResult::Ok || !resp) {
                spdlog::warn(
                    "AlertEmitter: send failed key={}",
                    dedupeKey);
                return;
            }
            auto code = static_cast<int>(
                resp->getStatusCode());
            if (code >= 400) {
                spdlog::warn(
                    "AlertEmitter: HTTP {} key={}",
                    code, dedupeKey);
            }
        });
}

AlertEmitter& alertEmitter()
{
    static AlertEmitter instance;
    return instance;
}

} // namespace nextra::alerts
