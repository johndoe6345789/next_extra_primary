/**
 * @file ReviewStore.cpp
 * @brief SQL impl for ReviewStore.
 */

#include "ecommerce/backend/ReviewStore.h"

namespace nextra::ecommerce
{

ReviewStore::ReviewStore(
    std::shared_ptr<drogon::orm::DbClient> db)
    : db_(std::move(db))
{
}

static Review rowToReview(const drogon::orm::Row& r)
{
    Review v;
    v.id        = r["id"].as<std::int64_t>();
    v.productId = r["product_id"].as<std::int64_t>();
    v.author    = r["author"].as<std::string>();
    v.rating    = r["rating"].as<std::int32_t>();
    v.body      = r["body"].as<std::string>();
    v.createdAt = r["created_at"].as<std::string>();
    return v;
}

std::vector<Review> ReviewStore::listForProduct(
    std::int64_t productId)
{
    std::vector<Review> out;
    auto rs = db_->execSqlSync(
        "SELECT id, product_id, author, rating, body,"
        " created_at FROM product_reviews"
        " WHERE product_id = $1"
        " ORDER BY created_at DESC", productId);
    for (const auto& row : rs)
        out.push_back(rowToReview(row));
    return out;
}

}  // namespace nextra::ecommerce
