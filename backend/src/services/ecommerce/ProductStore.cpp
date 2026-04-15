/**
 * @file ProductStore.cpp
 * @brief SQL impl for ProductStore.
 */

#include "services/ecommerce/ProductStore.h"

namespace nextra::ecommerce
{

ProductStore::ProductStore(
    std::shared_ptr<drogon::orm::DbClient> db)
    : db_(std::move(db))
{
}

static Product rowToProduct(const drogon::orm::Row& r)
{
    Product p;
    p.id          = r["id"].as<std::int64_t>();
    p.tenantId    = r["tenant_id"].as<std::int64_t>();
    p.sku         = r["sku"].as<std::string>();
    p.name        = r["name"].as<std::string>();
    p.description = r["description"].as<std::string>();
    p.priceCents  = r["price_cents"].as<std::int32_t>();
    p.currency    = r["currency"].as<std::string>();
    p.stock       = r["stock"].as<std::int32_t>();
    p.active      = r["active"].as<bool>();
    return p;
}

std::vector<Product> ProductStore::listActive()
{
    std::vector<Product> out;
    auto rs = db_->execSqlSync(
        "SELECT * FROM products WHERE active = TRUE "
        "ORDER BY name ASC");
    for (const auto& row : rs) out.push_back(rowToProduct(row));
    return out;
}

std::optional<Product> ProductStore::byId(std::int64_t id)
{
    auto rs = db_->execSqlSync(
        "SELECT * FROM products WHERE id = $1", id);
    if (rs.empty()) return std::nullopt;
    return rowToProduct(rs[0]);
}

std::int64_t ProductStore::insert(const Product& p)
{
    auto rs = db_->execSqlSync(
        "INSERT INTO products (tenant_id, sku, name, "
        "description, price_cents, currency, stock, active) "
        "VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id",
        p.tenantId, p.sku, p.name, p.description,
        p.priceCents, p.currency, p.stock, p.active);
    return rs[0]["id"].as<std::int64_t>();
}

void ProductStore::update(const Product& p)
{
    db_->execSqlSync(
        "UPDATE products SET name=$2, description=$3, "
        "price_cents=$4, currency=$5, stock=$6, active=$7, "
        "updated_at=NOW() WHERE id=$1",
        p.id, p.name, p.description, p.priceCents,
        p.currency, p.stock, p.active);
}

void ProductStore::deactivate(std::int64_t id)
{
    db_->execSqlSync(
        "UPDATE products SET active=FALSE, updated_at=NOW() "
        "WHERE id=$1", id);
}

bool ProductStore::decrementStock(
    std::int64_t id, std::int32_t qty)
{
    auto rs = db_->execSqlSync(
        "UPDATE products SET stock = stock - $2, "
        "updated_at=NOW() WHERE id=$1 AND stock >= $2 "
        "RETURNING id", id, qty);
    return !rs.empty();
}

}  // namespace nextra::ecommerce
