/**
 * @file WebhookSender.cpp
 * @brief WebhookSender — single-shot outbound POST.
 */

#include "services/notifications/WebhookSender.h"

#include <drogon/HttpClient.h>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

namespace nextra::notifications
{

DeliveryResult WebhookSender::send(
    const Notification& notif,
    const RenderedMessage& msg)
{
    if (!notif.data.is_object()
        || !notif.data.contains("url"))
        return {false, "webhook: missing data.url"};
    std::string url =
        notif.data.at("url").get<std::string>();
    try
    {
        auto client =
            drogon::HttpClient::newHttpClient(url);
        auto req = drogon::HttpRequest::newHttpRequest();
        req->setMethod(drogon::Post);
        req->setPath("/");
        nlohmann::json body = {
            {"template", notif.templateKey},
            {"subject", msg.subject},
            {"body", msg.body},
            {"data", notif.data},
        };
        req->setContentTypeCode(
            drogon::CT_APPLICATION_JSON);
        req->setBody(body.dump());
        auto [result, resp] =
            client->sendRequest(req, 10.0);
        if (result != drogon::ReqResult::Ok || !resp)
            return {false, "webhook unreachable"};
        if (resp->statusCode() >= 400)
            return {false, std::string{"HTTP "} +
                std::to_string(resp->statusCode())};
        return {true, ""};
    }
    catch (const std::exception& ex)
    {
        spdlog::warn(
            "WebhookSender failure: {}", ex.what());
        return {false, ex.what()};
    }
}

}  // namespace nextra::notifications
