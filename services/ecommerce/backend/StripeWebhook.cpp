/**
 * @file StripeWebhook.cpp
 * @brief HMAC-SHA256 signature verification plus
 *        JSON event dispatch for Stripe webhooks.
 */

#include "ecommerce/backend/StripeWebhook.h"

#include <nlohmann/json.hpp>
#include <openssl/hmac.h>
#include <spdlog/spdlog.h>

#include <cstring>
#include <sstream>

namespace nextra::ecommerce
{

static std::string hmacHex(
    const std::string& key, const std::string& data)
{
    unsigned char  out[32];
    unsigned int   len = 0;
    HMAC(EVP_sha256(), key.data(), (int)key.size(),
         reinterpret_cast<const unsigned char*>(data.data()),
         data.size(), out, &len);
    std::ostringstream ss;
    ss << std::hex;
    for (unsigned i = 0; i < len; ++i)
        ss << (out[i] >> 4) << (out[i] & 0xF);
    return ss.str();
}

static std::string pick(
    const std::string& header, const std::string& key)
{
    auto p = header.find(key + "=");
    if (p == std::string::npos) return {};
    p += key.size() + 1;
    auto end = header.find(',', p);
    return header.substr(p,
        end == std::string::npos ? std::string::npos : end - p);
}

StripeWebhook::StripeWebhook(
    std::shared_ptr<OrderService> orders,
    const std::string& signingSecret)
    : orders_(std::move(orders)), secret_(signingSecret)
{
}

bool StripeWebhook::verify(
    const std::string& payload,
    const std::string& sigHeader) const
{
    if (secret_.empty()) return true;  // dev mode
    auto t  = pick(sigHeader, "t");
    auto v1 = pick(sigHeader, "v1");
    if (t.empty() || v1.empty()) return false;
    auto signed_payload = t + "." + payload;
    auto expected = hmacHex(secret_, signed_payload);
    if (expected.size() != v1.size()) return false;
    int diff = 0;
    for (size_t i = 0; i < v1.size(); ++i)
        diff |= expected[i] ^ v1[i];
    return diff == 0;
}

bool StripeWebhook::dispatch(const std::string& payload)
{
    try {
        auto j    = nlohmann::json::parse(payload);
        auto type = j.at("type").get<std::string>();
        const auto& obj = j.at("data").at("object");
        auto pi   = obj.value("id", std::string{});
        if (type == "payment_intent.succeeded") {
            orders_->markPaidByPi(pi);
        } else if (type == "payment_intent.payment_failed") {
            orders_->markFailedByPi(pi);
        } else {
            spdlog::info("stripe: ignoring {}", type);
        }
        return true;
    } catch (const std::exception& e) {
        spdlog::error(
            "stripe webhook parse error: {}", e.what());
        return false;
    }
}

}  // namespace nextra::ecommerce
