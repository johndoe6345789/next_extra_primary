/**
 * @file OrderCreate.cpp
 * @brief createFromCart impl (split from
 *        OrderService.cpp for the 100 LOC cap).
 */

#include "services/ecommerce/OrderService.h"

namespace nextra::ecommerce
{

Order OrderService::createFromCart(std::int64_t userId)
{
    auto cart = carts_->getOrCreate(userId);
    auto rs = db_->execSqlSync(
        "INSERT INTO orders (user_id, status, "
        "total_cents, currency) VALUES ($1,$2,$3,$4) "
        "RETURNING id",
        userId, std::string{"pending"},
        cart.totalCents, cart.currency);
    std::int64_t orderId = rs[0]["id"].as<std::int64_t>();
    for (const auto& it : cart.items) {
        auto p = products_->byId(it.productId);
        if (!p) continue;
        db_->execSqlSync(
            "INSERT INTO order_items (order_id, "
            "product_id, qty, price_cents) "
            "VALUES ($1,$2,$3,$4)",
            orderId, it.productId, it.qty, p->priceCents);
    }
    carts_->clear(cart.id);
    return *byId(orderId);
}

}  // namespace nextra::ecommerce
