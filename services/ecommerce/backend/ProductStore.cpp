/**
 * @file ProductStore.cpp
 * @brief Read-side SQL impl for ProductStore. The
 *        mutating methods live in ProductStoreWrite.cpp
 *        so each file stays under the 100 LOC cap.
 */

#include "ecommerce/backend/ProductStore.h"

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
    p.slug        = r["slug"].as<std::string>();
    p.name        = r["name"].as<std::string>();
    p.description = r["description"].as<std::string>();
    p.priceCents  = r["price_cents"].as<std::int32_t>();
    p.currency    = r["currency"].as<std::string>();
    p.stock       = r["stock"].as<std::int32_t>();
    p.imageUrl    = r["image_url"].as<std::string>();
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

std::vector<Product> ProductStore::listActivePaged(
    std::int32_t limit, std::int32_t offset)
{
    std::vector<Product> out;
    // String-interpolate trusted ints — Drogon batch
    // params for LIMIT/OFFSET hit a known PG protocol
    // edge case in this codebase.
    auto sql = std::string{"SELECT * FROM products"}
        + " WHERE active = TRUE ORDER BY name ASC"
        + " LIMIT " + std::to_string(limit)
        + " OFFSET " + std::to_string(offset);
    auto rs = db_->execSqlSync(sql);
    for (const auto& row : rs)
        out.push_back(rowToProduct(row));
    return out;
}

std::int64_t ProductStore::countActive()
{
    auto rs = db_->execSqlSync(
        "SELECT COUNT(*) FROM products"
        " WHERE active = TRUE");
    if (rs.empty()) return 0;
    return rs[0][0].as<std::int64_t>();
}

std::optional<Product> ProductStore::byId(std::int64_t id)
{
    auto rs = db_->execSqlSync(
        "SELECT * FROM products WHERE id = $1", id);
    if (rs.empty()) return std::nullopt;
    return rowToProduct(rs[0]);
}

std::optional<Product> ProductStore::bySlug(
    const std::string& slug)
{
    auto rs = db_->execSqlSync(
        "SELECT * FROM products WHERE slug = $1", slug);
    if (rs.empty()) return std::nullopt;
    return rowToProduct(rs[0]);
}

}  // namespace nextra::ecommerce
