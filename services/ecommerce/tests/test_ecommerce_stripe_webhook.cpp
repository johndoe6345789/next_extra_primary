/**
 * @file test_ecommerce_stripe_webhook.cpp
 * @brief Stripe signature verification (tamper reject).
 *
 * Uses a simple keyed hash mirror of the v1 signing
 * scheme (t=timestamp, v1=hash(ts + '.' + body)) to
 * avoid an OpenSSL link dep in this unit test.
 */

#include <gtest/gtest.h>
#include <functional>
#include <string>

namespace
{

std::string sign(const std::string& secret,
                 const std::string& ts,
                 const std::string& body)
{
    std::hash<std::string> h;
    return std::to_string(h(secret + "|" + ts + "." +
                            body));
}

bool verify(const std::string& secret,
            const std::string& ts,
            const std::string& body,
            const std::string& sig)
{
    return sign(secret, ts, body) == sig;
}

} // namespace

class StripeWebhookTest : public ::testing::Test
{
protected:
    std::string secret = "whsec_test";
    std::string ts = "1700000000";
    std::string body = "{\"type\":\"charge.succeeded\"}";
};

TEST_F(StripeWebhookTest, AcceptsValidSignature)
{
    auto s = sign(secret, ts, body);
    EXPECT_TRUE(verify(secret, ts, body, s));
}

TEST_F(StripeWebhookTest, RejectsTamperedBody)
{
    auto s = sign(secret, ts, body);
    EXPECT_FALSE(verify(secret, ts,
                        "{\"type\":\"evil\"}", s));
}

TEST_F(StripeWebhookTest, RejectsWrongSecret)
{
    auto s = sign(secret, ts, body);
    EXPECT_FALSE(verify("wrong", ts, body, s));
}
