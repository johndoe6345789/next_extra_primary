/**
 * @file ReviewStoreWrite.cpp
 * @brief Mutating SQL impl for ReviewStore (split from
 *        ReviewStore.cpp to stay under the 100-LOC cap).
 */

#include "ecommerce/backend/ReviewStore.h"

namespace nextra::ecommerce
{

static Review rowToReviewW(const drogon::orm::Row& r)
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

std::optional<Review> ReviewStore::byId(std::int64_t id)
{
    auto rs = db_->execSqlSync(
        "SELECT id, product_id, author, rating, body,"
        " created_at FROM product_reviews"
        " WHERE id = $1", id);
    if (rs.empty()) return std::nullopt;
    return rowToReviewW(rs[0]);
}

Review ReviewStore::upsertForUser(
    std::int64_t productId, const std::string& userId,
    const std::string& author, std::int32_t rating,
    const std::string& body)
{
    auto rs = db_->execSqlSync(
        "INSERT INTO product_reviews"
        " (product_id, user_id, author, rating, body)"
        " VALUES ($1,$2,$3,$4,$5)"
        " ON CONFLICT (product_id, user_id)"
        " WHERE user_id IS NOT NULL"
        " DO UPDATE SET rating = EXCLUDED.rating,"
        " body = EXCLUDED.body, updated_at = NOW()"
        " RETURNING id, product_id, author, rating,"
        " body, created_at",
        productId, userId, author,
        static_cast<std::int16_t>(rating), body);
    return rowToReviewW(rs[0]);
}

std::optional<Review> ReviewStore::updateById(
    std::int64_t id, std::int32_t rating,
    const std::string& body)
{
    auto rs = db_->execSqlSync(
        "UPDATE product_reviews SET rating=$2,"
        " body=$3, updated_at=NOW() WHERE id=$1"
        " RETURNING id, product_id, author, rating,"
        " body, created_at",
        id, static_cast<std::int16_t>(rating), body);
    if (rs.empty()) return std::nullopt;
    return rowToReviewW(rs[0]);
}

bool ReviewStore::deleteById(std::int64_t id)
{
    auto rs = db_->execSqlSync(
        "DELETE FROM product_reviews WHERE id=$1"
        " RETURNING id", id);
    return !rs.empty();
}

std::optional<std::string> ReviewStore::ownerOf(
    std::int64_t id)
{
    auto rs = db_->execSqlSync(
        "SELECT user_id FROM product_reviews"
        " WHERE id=$1", id);
    if (rs.empty() || rs[0]["user_id"].isNull())
        return std::nullopt;
    return rs[0]["user_id"].as<std::string>();
}

}  // namespace nextra::ecommerce
