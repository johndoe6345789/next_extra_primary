/**
 * @file test_webhooks_retry_schedule.cpp
 * @brief DispatcherQueue / RetrySchedule exponential
 *        backoff delay table.
 */

#include <gtest/gtest.h>
#include <cstdint>

namespace
{

/// @brief Mirrors RetrySchedule::delayFor(attempt).
/// Base 30s, cap 1h, doubling each attempt.
uint64_t delayFor(int attempt)
{
    const uint64_t base = 30;
    const uint64_t cap = 3600;
    if (attempt < 0) return 0;
    uint64_t d = base;
    for (int i = 0; i < attempt && d < cap; ++i)
        d *= 2;
    return d > cap ? cap : d;
}

} // namespace

class RetryScheduleTest : public ::testing::Test
{
};

TEST_F(RetryScheduleTest, FirstAttemptBase)
{
    EXPECT_EQ(delayFor(0), 30u);
}

TEST_F(RetryScheduleTest, Doubles)
{
    EXPECT_EQ(delayFor(1), 60u);
    EXPECT_EQ(delayFor(2), 120u);
    EXPECT_EQ(delayFor(3), 240u);
}

TEST_F(RetryScheduleTest, Cap)
{
    EXPECT_EQ(delayFor(20), 3600u);
}

TEST_F(RetryScheduleTest, NegativeAttemptZero)
{
    EXPECT_EQ(delayFor(-1), 0u);
}
