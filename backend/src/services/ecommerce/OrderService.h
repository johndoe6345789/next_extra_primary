#pragma once
/**
 * @file OrderService.h
 * @brief Order lifecycle: create from cart,
 *        mark paid/failed, ship.
 */

#include "services/ecommerce/CartService.h"
#include "services/ecommerce/EcommerceTypes.h"

#include <drogon/orm/DbClient.h>

#include <memory>
#include <optional>
#include <vector>

namespace nextra::ecommerce
{

class OrderService
{
  public:
    OrderService(
        std::shared_ptr<drogon::orm::DbClient> db,
        std::shared_ptr<ProductStore> products,
        std::shared_ptr<CartService>  carts);

    /** @brief Convert the user's cart to a new order. */
    Order createFromCart(std::int64_t userId);

    /** @brief Attach a stripe PaymentIntent id. */
    void setStripePi(std::int64_t orderId,
                     const std::string& pi);

    /** @brief Mark an order paid (sets paid_at). */
    void markPaidByPi(const std::string& pi);

    /** @brief Mark an order failed. */
    void markFailedByPi(const std::string& pi);

    /** @brief Mark an order shipped. */
    void markShipped(std::int64_t orderId);

    /** @brief List orders for a user (latest first). */
    std::vector<Order> listForUser(std::int64_t userId);

    /** @brief Admin: list all orders, latest first. */
    std::vector<Order> listAll(std::int32_t limit);

    /** @brief Fetch one order with lines. */
    std::optional<Order> byId(std::int64_t id);

  private:
    std::shared_ptr<drogon::orm::DbClient> db_;
    std::shared_ptr<ProductStore>          products_;
    std::shared_ptr<CartService>           carts_;
};

}  // namespace nextra::ecommerce
