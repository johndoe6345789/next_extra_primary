/**
 * @file ProductStoreWrite.cpp
 * @brief Mutating SQL impl for ProductStore — split
 *        from ProductStore.cpp (read half) so each
 *        file stays under the 100 LOC cap.
 */

#include "ecommerce/backend/ProductStore.h"

namespace nextra::ecommerce
{

std::int64_t ProductStore::insert(const Product& p)
{
    auto rs = db_->execSqlSync(
        "INSERT INTO products (tenant_id, sku, slug,"
        " name, description, price_cents, currency,"
        " stock, image_url, active)"
        " VALUES"
        " ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)"
        " RETURNING id",
        p.tenantId, p.sku, p.slug, p.name, p.description,
        p.priceCents, p.currency, p.stock, p.imageUrl,
        p.active);
    return rs[0]["id"].as<std::int64_t>();
}

void ProductStore::update(const Product& p)
{
    db_->execSqlSync(
        "UPDATE products SET name=$2, description=$3,"
        " price_cents=$4, currency=$5, stock=$6,"
        " active=$7, updated_at=NOW() WHERE id=$1",
        p.id, p.name, p.description, p.priceCents,
        p.currency, p.stock, p.active);
}

void ProductStore::deactivate(std::int64_t id)
{
    db_->execSqlSync(
        "UPDATE products SET active=FALSE,"
        " updated_at=NOW() WHERE id=$1", id);
}

bool ProductStore::decrementStock(
    std::int64_t id, std::int32_t qty)
{
    auto rs = db_->execSqlSync(
        "UPDATE products SET stock = stock - $2,"
        " updated_at=NOW() WHERE id=$1 AND stock >= $2"
        " RETURNING id", id, qty);
    return !rs.empty();
}

}  // namespace nextra::ecommerce
