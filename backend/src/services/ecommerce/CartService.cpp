/**
 * @file CartService.cpp
 * @brief SQL impl for CartService.
 */

#include "services/ecommerce/CartService.h"

namespace nextra::ecommerce
{

CartService::CartService(
    std::shared_ptr<drogon::orm::DbClient> db,
    std::shared_ptr<ProductStore> products)
    : db_(std::move(db)), products_(std::move(products))
{
}

Cart CartService::load(std::int64_t cartId, std::int64_t userId)
{
    Cart c;
    c.id     = cartId;
    c.userId = userId;
    auto rs = db_->execSqlSync(
        "SELECT product_id, qty FROM cart_items "
        "WHERE cart_id = $1", cartId);
    for (const auto& r : rs) {
        CartItem it;
        it.productId = r["product_id"].as<std::int64_t>();
        it.qty       = r["qty"].as<std::int32_t>();
        auto p       = products_->byId(it.productId);
        if (p) {
            c.totalCents += p->priceCents * it.qty;
            c.currency   = p->currency;
        }
        c.items.push_back(it);
    }
    return c;
}

Cart CartService::getOrCreate(std::int64_t userId)
{
    auto rs = db_->execSqlSync(
        "SELECT id FROM carts WHERE user_id=$1 "
        "ORDER BY created_at DESC LIMIT 1", userId);
    std::int64_t cartId;
    if (rs.empty()) {
        auto ins = db_->execSqlSync(
            "INSERT INTO carts (user_id) VALUES ($1) "
            "RETURNING id", userId);
        cartId = ins[0]["id"].as<std::int64_t>();
    } else {
        cartId = rs[0]["id"].as<std::int64_t>();
    }
    return load(cartId, userId);
}

Cart CartService::addItem(
    std::int64_t userId, std::int64_t productId, std::int32_t qty)
{
    auto c = getOrCreate(userId);
    db_->execSqlSync(
        "INSERT INTO cart_items (cart_id, product_id, qty) "
        "VALUES ($1,$2,$3) "
        "ON CONFLICT (cart_id, product_id) DO UPDATE "
        "SET qty = cart_items.qty + EXCLUDED.qty",
        c.id, productId, qty);
    return load(c.id, userId);
}

Cart CartService::setQty(
    std::int64_t userId, std::int64_t productId, std::int32_t qty)
{
    auto c = getOrCreate(userId);
    if (qty <= 0) {
        db_->execSqlSync(
            "DELETE FROM cart_items "
            "WHERE cart_id=$1 AND product_id=$2",
            c.id, productId);
    } else {
        db_->execSqlSync(
            "INSERT INTO cart_items (cart_id, product_id, qty) "
            "VALUES ($1,$2,$3) "
            "ON CONFLICT (cart_id, product_id) DO UPDATE "
            "SET qty = EXCLUDED.qty",
            c.id, productId, qty);
    }
    return load(c.id, userId);
}

void CartService::clear(std::int64_t cartId)
{
    db_->execSqlSync(
        "DELETE FROM cart_items WHERE cart_id=$1", cartId);
}

}  // namespace nextra::ecommerce
