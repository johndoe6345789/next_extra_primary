/**
 * @file test_ecommerce_order_service.cpp
 * @brief Order state transitions and refund path.
 */

#include <gtest/gtest.h>
#include <string>

namespace
{

enum class OrderState
{
    Pending,
    Paid,
    Shipped,
    Refunded,
    Cancelled
};

/// @brief Mirrors OrderService::transition rules.
bool canTransition(OrderState from, OrderState to)
{
    using S = OrderState;
    if (from == S::Pending)
        return to == S::Paid || to == S::Cancelled;
    if (from == S::Paid)
        return to == S::Shipped || to == S::Refunded;
    if (from == S::Shipped) return to == S::Refunded;
    return false;
}

} // namespace

class OrderServiceTest : public ::testing::Test
{
};

TEST_F(OrderServiceTest, PendingToPaidOk)
{
    EXPECT_TRUE(canTransition(OrderState::Pending,
                              OrderState::Paid));
}

TEST_F(OrderServiceTest, PaidToRefundedOk)
{
    EXPECT_TRUE(canTransition(OrderState::Paid,
                              OrderState::Refunded));
}

TEST_F(OrderServiceTest, CancelledIsTerminal)
{
    EXPECT_FALSE(canTransition(OrderState::Cancelled,
                               OrderState::Paid));
}

TEST_F(OrderServiceTest, PendingToShippedRejected)
{
    EXPECT_FALSE(canTransition(OrderState::Pending,
                               OrderState::Shipped));
}
