#pragma once
/**
 * @file ReviewStore.h
 * @brief Postgres-backed reads for product reviews.
 *        Write flow lives elsewhere when added.
 */

#include "ecommerce/backend/EcommerceTypes.h"

#include <drogon/orm/DbClient.h>

#include <memory>
#include <optional>
#include <string>
#include <vector>

namespace nextra::ecommerce
{

class ReviewStore
{
  public:
    explicit ReviewStore(
        std::shared_ptr<drogon::orm::DbClient> db);

    /** @brief List reviews for a product, newest first. */
    std::vector<Review> listForProduct(
        std::int64_t productId);

    /**
     * @brief Fetch a single review by id.
     * @return std::nullopt if no row matches.
     */
    std::optional<Review> byId(std::int64_t id);

    /**
     * @brief Upsert a review by (product_id, user_id).
     * @return The persisted review row.
     * @throws drogon::orm::DrogonDbException on SQL error.
     */
    Review upsertForUser(std::int64_t productId,
                        const std::string& userId,
                        const std::string& author,
                        std::int32_t rating,
                        const std::string& body);

    /**
     * @brief Update a review's rating + body in place.
     * @return The updated row, or nullopt if id is gone.
     */
    std::optional<Review> updateById(
        std::int64_t id, std::int32_t rating,
        const std::string& body);

    /**
     * @brief Delete a review row.
     * @return true if a row was removed.
     */
    bool deleteById(std::int64_t id);

    /**
     * @brief Fetch the user_id (JWT sub) that owns a
     *        review, if any. Returns std::nullopt for
     *        legacy rows seeded with author-only.
     */
    std::optional<std::string> ownerOf(std::int64_t id);

  private:
    std::shared_ptr<drogon::orm::DbClient> db_;
};

}  // namespace nextra::ecommerce
