#pragma once
/**
 * @file CartService.h
 * @brief Per-user cart operations.
 */

#include "services/ecommerce/EcommerceTypes.h"
#include "services/ecommerce/ProductStore.h"

#include <drogon/orm/DbClient.h>

#include <memory>

namespace nextra::ecommerce
{

class CartService
{
  public:
    CartService(
        std::shared_ptr<drogon::orm::DbClient> db,
        std::shared_ptr<ProductStore> products);

    /** @brief Get or create the user's cart. */
    Cart getOrCreate(std::int64_t userId);

    /** @brief Add or increment a line. */
    Cart addItem(std::int64_t userId,
                 std::int64_t productId,
                 std::int32_t qty);

    /** @brief Set an exact qty; qty=0 removes. */
    Cart setQty(std::int64_t userId,
                std::int64_t productId,
                std::int32_t qty);

    /** @brief Clear all items from the cart. */
    void clear(std::int64_t cartId);

  private:
    Cart load(std::int64_t cartId, std::int64_t userId);

    std::shared_ptr<drogon::orm::DbClient> db_;
    std::shared_ptr<ProductStore>          products_;
};

}  // namespace nextra::ecommerce
