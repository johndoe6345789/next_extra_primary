/**
 * @file test_polls_vote_idempotence.cpp
 * @brief One vote per user per poll.
 */

#include <gtest/gtest.h>
#include <string>
#include <unordered_map>

namespace
{

struct PollStore
{
    // (pollId,userId) -> optionId
    std::unordered_map<std::string, std::string> votes;

    bool vote(const std::string& pollId,
              const std::string& userId,
              const std::string& opt)
    {
        auto k = pollId + "#" + userId;
        auto it = votes.find(k);
        if (it != votes.end()) return false;
        votes[k] = opt;
        return true;
    }
};

} // namespace

class PollsVoteTest : public ::testing::Test
{
protected:
    PollStore s;
};

TEST_F(PollsVoteTest, FirstVoteAccepted)
{
    EXPECT_TRUE(s.vote("p1", "u1", "a"));
}

TEST_F(PollsVoteTest, SecondVoteRejected)
{
    s.vote("p1", "u1", "a");
    EXPECT_FALSE(s.vote("p1", "u1", "b"));
}

TEST_F(PollsVoteTest, DifferentUsersOk)
{
    EXPECT_TRUE(s.vote("p1", "u1", "a"));
    EXPECT_TRUE(s.vote("p1", "u2", "a"));
}

TEST_F(PollsVoteTest, DifferentPollsOk)
{
    EXPECT_TRUE(s.vote("p1", "u1", "a"));
    EXPECT_TRUE(s.vote("p2", "u1", "a"));
}
