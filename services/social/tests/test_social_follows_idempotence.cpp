/**
 * @file test_social_follows_idempotence.cpp
 * @brief Following the same user twice is a no-op.
 */

#include <gtest/gtest.h>
#include <string>
#include <unordered_set>

namespace
{

struct FollowStore
{
    std::unordered_set<std::string> edges;
    bool follow(const std::string& a, const std::string& b)
    {
        if (a == b) return false;
        auto key = a + ">" + b;
        if (edges.count(key)) return false;
        edges.insert(key);
        return true;
    }
};

} // namespace

class SocialFollowsTest : public ::testing::Test
{
protected:
    FollowStore s;
};

TEST_F(SocialFollowsTest, FirstFollowOk)
{
    EXPECT_TRUE(s.follow("u1", "u2"));
    EXPECT_EQ(s.edges.size(), 1u);
}

TEST_F(SocialFollowsTest, DuplicateFollowNoop)
{
    s.follow("u1", "u2");
    EXPECT_FALSE(s.follow("u1", "u2"));
    EXPECT_EQ(s.edges.size(), 1u);
}

TEST_F(SocialFollowsTest, SelfFollowRejected)
{
    EXPECT_FALSE(s.follow("u1", "u1"));
}

TEST_F(SocialFollowsTest, ReverseIsSeparate)
{
    s.follow("u1", "u2");
    EXPECT_TRUE(s.follow("u2", "u1"));
}
