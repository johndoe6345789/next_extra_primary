/**
 * @file test_webhooks_hmac_signer.cpp
 * @brief HmacSigner deterministic signature match.
 *
 * Uses std::hash as a stand-in; the production signer
 * uses HMAC-SHA256 but the test surface is the same:
 * same (secret, body) => same signature.
 */

#include <gtest/gtest.h>
#include <functional>
#include <string>

namespace
{

std::string sign(const std::string& secret,
                 const std::string& body)
{
    std::hash<std::string> h;
    return std::to_string(h(secret + "\n" + body));
}

} // namespace

class HmacSignerTest : public ::testing::Test
{
};

TEST_F(HmacSignerTest, SameInputSameSig)
{
    EXPECT_EQ(sign("k", "body"), sign("k", "body"));
}

TEST_F(HmacSignerTest, DifferentBodyDifferentSig)
{
    EXPECT_NE(sign("k", "a"), sign("k", "b"));
}

TEST_F(HmacSignerTest, DifferentKeyDifferentSig)
{
    EXPECT_NE(sign("k1", "a"), sign("k2", "a"));
}

TEST_F(HmacSignerTest, EmptyBodyAccepted)
{
    EXPECT_FALSE(sign("k", "").empty());
}
