/**
 * @file test_forum_thread_depth.cpp
 * @brief Threaded forum post insertion respects a
 *        maximum reply depth cap.
 */

#include <gtest/gtest.h>

namespace
{

constexpr int MAX_DEPTH = 5;

/// @brief Returns the depth of a new reply or -1 if
/// the insert should be rejected.
int insertReply(int parentDepth)
{
    int d = parentDepth + 1;
    if (d > MAX_DEPTH) return -1;
    return d;
}

} // namespace

class ForumThreadDepthTest : public ::testing::Test
{
};

TEST_F(ForumThreadDepthTest, RootDepthZero)
{
    EXPECT_EQ(insertReply(-1), 0);
}

TEST_F(ForumThreadDepthTest, WithinCapAccepted)
{
    EXPECT_EQ(insertReply(3), 4);
    EXPECT_EQ(insertReply(4), 5);
}

TEST_F(ForumThreadDepthTest, BeyondCapRejected)
{
    EXPECT_EQ(insertReply(5), -1);
}

TEST_F(ForumThreadDepthTest, FarBeyondCapRejected)
{
    EXPECT_EQ(insertReply(100), -1);
}
