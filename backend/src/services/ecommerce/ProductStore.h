#pragma once
/**
 * @file ProductStore.h
 * @brief Postgres-backed CRUD for products.
 */

#include "services/ecommerce/EcommerceTypes.h"

#include <drogon/orm/DbClient.h>

#include <memory>
#include <optional>
#include <vector>

namespace nextra::ecommerce
{

class ProductStore
{
  public:
    explicit ProductStore(
        std::shared_ptr<drogon::orm::DbClient> db);

    /** @brief List all active products. */
    std::vector<Product> listActive();

    /** @brief Fetch one product by id. */
    std::optional<Product> byId(std::int64_t id);

    /** @brief Insert a product, return new id. */
    std::int64_t insert(const Product& p);

    /** @brief Update mutable fields by id. */
    void update(const Product& p);

    /** @brief Soft delete: set active = false. */
    void deactivate(std::int64_t id);

    /** @brief Atomically decrement stock. */
    bool decrementStock(std::int64_t id, std::int32_t qty);

  private:
    std::shared_ptr<drogon::orm::DbClient> db_;
};

}  // namespace nextra::ecommerce
