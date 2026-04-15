/**
 * @file StripeClient.cpp
 * @brief Drogon-HttpClient impl for StripeClient.
 */

#include "ecommerce/backend/StripeClient.h"

#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

namespace nextra::ecommerce
{

StripeClient::StripeClient(
    const std::string& apiBase,
    const std::string& secretKey)
    : apiBase_(apiBase), secretKey_(secretKey)
{
    client_ = drogon::HttpClient::newHttpClient(apiBase_);
}

std::optional<PaymentIntentResult>
StripeClient::createPaymentIntent(
    std::int64_t amountCents, const std::string& currency)
{
    if (secretKey_.empty()) {
        spdlog::warn(
            "StripeClient: no secret key set; "
            "returning stub PaymentIntent");
        PaymentIntentResult stub;
        stub.id           = "pi_stub";
        stub.clientSecret = "pi_stub_secret";
        return stub;
    }
    auto req = drogon::HttpRequest::newHttpFormPostRequest();
    req->setPath("/v1/payment_intents");
    req->addHeader("Authorization", "Bearer " + secretKey_);
    req->setParameter("amount", std::to_string(amountCents));
    req->setParameter("currency", currency);
    req->setParameter("automatic_payment_methods[enabled]",
                      "true");
    auto [res, resp] = client_->sendRequest(req, 10.0);
    if (res != drogon::ReqResult::Ok || !resp) {
        spdlog::error(
            "StripeClient: network error creating PI");
        return std::nullopt;
    }
    if (resp->statusCode() >= 400) {
        spdlog::error(
            "StripeClient: {} body={}",
            (int)resp->statusCode(),
            std::string{resp->body()});
        return std::nullopt;
    }
    try {
        auto j = nlohmann::json::parse(resp->body());
        PaymentIntentResult out;
        out.id           = j.at("id").get<std::string>();
        out.clientSecret =
            j.at("client_secret").get<std::string>();
        return out;
    } catch (const std::exception& e) {
        spdlog::error("StripeClient: parse error: {}",
                      e.what());
        return std::nullopt;
    }
}

}  // namespace nextra::ecommerce
