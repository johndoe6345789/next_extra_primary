/**
 * @file test_image_job_store.cpp
 * @brief Mirror-logic tests for ImageJobStore transitions.
 *
 * The production store hits Postgres. Here we mirror its
 * retry / terminal-state logic against an in-memory job
 * record to validate the decision table.
 */

#include <gtest/gtest.h>

#include <string>

namespace
{

struct Row
{
    std::string status{"pending"};
    int attempts{0};
    std::string error;
};

/// @brief Mirrors ImageJobStore::markFailed semantics.
void markFailed(Row& r, int maxTries,
                const std::string& err)
{
    r.attempts += 1;
    r.error = err;
    r.status = (r.attempts >= maxTries)
                   ? "failed"
                   : "pending";
}

/// @brief Mirrors ImageJobStore::markSuccess.
void markSuccess(Row& r)
{
    r.status = "success";
    r.error.clear();
}

}  // namespace

class ImageJobStoreTest : public ::testing::Test
{
};

TEST_F(ImageJobStoreTest, FirstFailureRequeues)
{
    Row r;
    markFailed(r, 5, "fetch");
    EXPECT_EQ(r.status, "pending");
    EXPECT_EQ(r.attempts, 1);
}

TEST_F(ImageJobStoreTest, BudgetExhaustionTerminates)
{
    Row r;
    for (int i = 0; i < 5; ++i)
        markFailed(r, 5, "boom");
    EXPECT_EQ(r.status, "failed");
    EXPECT_EQ(r.attempts, 5);
}

TEST_F(ImageJobStoreTest, SuccessClearsError)
{
    Row r{"running", 1, "prev"};
    markSuccess(r);
    EXPECT_EQ(r.status, "success");
    EXPECT_TRUE(r.error.empty());
}
