/**
 * @file EmailSender.cpp
 * @brief EmailSender — posts JSON to emailclient-api.
 */

#include "notifications/backend/EmailSender.h"

#include <drogon/HttpClient.h>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

namespace nextra::notifications
{

EmailSender::EmailSender(std::string endpoint)
    : endpoint_(std::move(endpoint))
{
}

DeliveryResult EmailSender::send(
    const Notification& notif,
    const RenderedMessage& msg)
{
    try
    {
        auto client = drogon::HttpClient::newHttpClient(
            endpoint_);
        auto req = drogon::HttpRequest::newHttpRequest();
        req->setMethod(drogon::Post);
        req->setPath("/send");
        nlohmann::json body = {
            {"to", notif.userId},
            {"subject", msg.subject},
            {"body", msg.body},
            {"template", notif.templateKey},
        };
        req->setContentTypeCode(
            drogon::CT_APPLICATION_JSON);
        req->setBody(body.dump());
        auto [result, resp] =
            client->sendRequest(req, 10.0);
        if (result != drogon::ReqResult::Ok || !resp)
            return {false, "emailclient unreachable"};
        if (resp->statusCode() >= 400)
            return {false, std::string{"HTTP "} +
                std::to_string(resp->statusCode())};
        return {true, ""};
    }
    catch (const std::exception& ex)
    {
        spdlog::warn("EmailSender failure: {}", ex.what());
        return {false, ex.what()};
    }
}

}  // namespace nextra::notifications
