/**
 * @file WebhookClient.cpp
 * @brief drogon::HttpClient implementation of send().
 */

#include "services/webhooks/WebhookClient.h"
#include "services/webhooks/HmacSigner.h"

#include <drogon/HttpClient.h>
#include <drogon/HttpRequest.h>
#include <drogon/HttpResponse.h>
#include <drogon/HttpTypes.h>

#include <chrono>
#include <string>

namespace nextra::webhooks
{

static std::pair<std::string, std::string> splitUrl(const std::string& url)
{
    const auto pos = url.find("://");
    if (pos == std::string::npos) return {url, "/"};
    const auto after = url.find('/', pos + 3);
    if (after == std::string::npos) return {url, "/"};
    return {url.substr(0, after), url.substr(after)};
}

static std::string unixNowSeconds()
{
    const auto now = std::chrono::system_clock::now().time_since_epoch();
    const auto secs = std::chrono::duration_cast<std::chrono::seconds>(now);
    return std::to_string(secs.count());
}

DeliveryResult WebhookClient::send(const DeliveryJob& job)
{
    DeliveryResult out;
    const auto [base, path] = splitUrl(job.url);
    auto client = drogon::HttpClient::newHttpClient(base);
    client->setTimeout(cfg_.requestTimeout.count() / 1000.0);
    auto req = drogon::HttpRequest::newHttpRequest();
    req->setMethod(drogon::Post);
    req->setPath(path);
    req->setContentTypeCode(drogon::CT_APPLICATION_JSON);
    req->setBody(job.payload);
    const auto ts = unixNowSeconds();
    const auto sig = signHmacSha256(job.secret, ts, job.payload);
    req->addHeader(cfg_.timestampHeader, ts);
    req->addHeader(cfg_.signatureHeader, "sha256=" + sig);
    req->addHeader("X-Nextra-Event", job.eventType);
    auto [result, resp] = client->sendRequest(
        req, cfg_.requestTimeout.count() / 1000.0);
    if (result != drogon::ReqResult::Ok || !resp)
    {
        out.success = false;
        out.statusCode = 0;
        out.error = "transport error";
        return out;
    }
    out.statusCode = static_cast<int>(resp->statusCode());
    out.success = out.statusCode >= 200 && out.statusCode < 300;
    if (!out.success) out.error = "non-2xx response";
    return out;
}

}  // namespace nextra::webhooks
