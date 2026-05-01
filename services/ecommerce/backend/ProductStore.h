#pragma once
/**
 * @file ProductStore.h
 * @brief Postgres-backed CRUD for products.
 */

#include "ecommerce/backend/EcommerceTypes.h"

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

    /** @brief List active products with limit/offset. */
    std::vector<Product> listActivePaged(
        std::int32_t limit, std::int32_t offset);

    /** @brief Count active products. */
    std::int64_t countActive();

    /** @brief Fetch one product by id. */
    std::optional<Product> byId(std::int64_t id);

    /** @brief Fetch one product by slug. */
    std::optional<Product> bySlug(
        const std::string& slug);

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
