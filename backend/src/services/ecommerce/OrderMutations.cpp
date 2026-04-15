/**
 * @file OrderMutations.cpp
 * @brief Status-mutation methods for OrderService
 *        (keeps OrderService.cpp under the 100 LOC cap).
 */

#include "services/ecommerce/OrderService.h"

namespace nextra::ecommerce
{

void OrderService::setStripePi(
    std::int64_t orderId, const std::string& pi)
{
    db_->execSqlSync(
        "UPDATE orders SET stripe_pi=$2 WHERE id=$1",
        orderId, pi);
}

void OrderService::markPaidByPi(const std::string& pi)
{
    db_->execSqlSync(
        "UPDATE orders SET status='paid', paid_at=NOW() "
        "WHERE stripe_pi=$1 AND status='pending'", pi);
}

void OrderService::markFailedByPi(const std::string& pi)
{
    db_->execSqlSync(
        "UPDATE orders SET status='failed' "
        "WHERE stripe_pi=$1 AND status='pending'", pi);
}

void OrderService::markShipped(std::int64_t orderId)
{
    db_->execSqlSync(
        "UPDATE orders SET status='shipped', "
        "shipped_at=NOW() WHERE id=$1", orderId);
}

}  // namespace nextra::ecommerce
