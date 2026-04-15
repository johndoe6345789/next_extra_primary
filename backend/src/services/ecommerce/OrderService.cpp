/**
 * @file OrderService.cpp
 * @brief Read-side impl for OrderService. Mutations
 *        in OrderMutations.cpp, creation in
 *        OrderCreate.cpp.
 */

#include "services/ecommerce/OrderService.h"

namespace nextra::ecommerce
{

OrderService::OrderService(
    std::shared_ptr<drogon::orm::DbClient> db,
    std::shared_ptr<ProductStore> products,
    std::shared_ptr<CartService>  carts)
    : db_(std::move(db)),
      products_(std::move(products)),
      carts_(std::move(carts))
{
}

static Order rowToOrder(const drogon::orm::Row& r)
{
    Order o;
    o.id         = r["id"].as<std::int64_t>();
    o.userId     = r["user_id"].as<std::int64_t>();
    o.status     = statusFromString(
        r["status"].as<std::string>());
    o.totalCents = r["total_cents"].as<std::int32_t>();
    o.currency   = r["currency"].as<std::string>();
    if (!r["stripe_pi"].isNull())
        o.stripePi = r["stripe_pi"].as<std::string>();
    return o;
}

static void loadLines(drogon::orm::DbClient& db, Order& o)
{
    auto rs = db.execSqlSync(
        "SELECT product_id, qty, price_cents "
        "FROM order_items WHERE order_id = $1", o.id);
    for (const auto& r : rs) {
        OrderLine l;
        l.productId  = r["product_id"].as<std::int64_t>();
        l.qty        = r["qty"].as<std::int32_t>();
        l.priceCents = r["price_cents"].as<std::int32_t>();
        o.lines.push_back(l);
    }
}

std::vector<Order> OrderService::listForUser(
    std::int64_t userId)
{
    std::vector<Order> out;
    auto rs = db_->execSqlSync(
        "SELECT * FROM orders WHERE user_id=$1 "
        "ORDER BY created_at DESC", userId);
    for (const auto& r : rs) {
        auto o = rowToOrder(r);
        loadLines(*db_, o);
        out.push_back(std::move(o));
    }
    return out;
}

std::vector<Order> OrderService::listAll(std::int32_t limit)
{
    std::vector<Order> out;
    auto rs = db_->execSqlSync(
        "SELECT * FROM orders ORDER BY created_at DESC "
        "LIMIT $1", limit);
    for (const auto& r : rs) {
        auto o = rowToOrder(r);
        loadLines(*db_, o);
        out.push_back(std::move(o));
    }
    return out;
}

std::optional<Order> OrderService::byId(std::int64_t id)
{
    auto rs = db_->execSqlSync(
        "SELECT * FROM orders WHERE id=$1", id);
    if (rs.empty()) return std::nullopt;
    auto o = rowToOrder(rs[0]);
    loadLines(*db_, o);
    return o;
}

}  // namespace nextra::ecommerce
