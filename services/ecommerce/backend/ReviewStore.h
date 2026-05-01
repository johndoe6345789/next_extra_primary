#pragma once
/**
 * @file ReviewStore.h
 * @brief Postgres-backed reads for product reviews.
 *        Write flow lives elsewhere when added.
 */

#include "ecommerce/backend/EcommerceTypes.h"

#include <drogon/orm/DbClient.h>

#include <memory>
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

  private:
    std::shared_ptr<drogon::orm::DbClient> db_;
};

}  // namespace nextra::ecommerce
