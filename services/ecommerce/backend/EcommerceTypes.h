#pragma once
/**
 * @file EcommerceTypes.h
 * @brief POD types shared across the ecommerce
 *        daemon (products, carts, orders).
 */

#include <cstdint>
#include <optional>
#include <string>
#include <vector>

namespace nextra::ecommerce
{

/** A single product row. */
struct Product
{
    std::int64_t id{0};
    std::int64_t tenantId{0};
    std::string  sku;
    std::string  name;
    std::string  description;
    std::int32_t priceCents{0};
    std::string  currency{"USD"};
    std::int32_t stock{0};
    bool         active{true};
};

/** A cart line item. */
struct CartItem
{
    std::int64_t productId{0};
    std::int32_t qty{0};
};

/** An entire cart with resolved items. */
struct Cart
{
    std::int64_t          id{0};
    std::int64_t          userId{0};
    std::vector<CartItem> items;
    std::int32_t          totalCents{0};
    std::string           currency{"USD"};
};

/** Order status state machine. */
enum class OrderStatus
{
    Pending,
    Paid,
    Failed,
    Shipped,
    Cancelled
};

/** A single order line item. */
struct OrderLine
{
    std::int64_t productId{0};
    std::int32_t qty{0};
    std::int32_t priceCents{0};
};

/** An order header + lines. */
struct Order
{
    std::int64_t               id{0};
    std::int64_t               userId{0};
    OrderStatus                status{OrderStatus::Pending};
    std::int32_t               totalCents{0};
    std::string                currency{"USD"};
    std::optional<std::string> stripePi;
    std::vector<OrderLine>     lines;
};

/** Convert enum -> DB string. */
std::string statusToString(OrderStatus s);

/** Convert DB string -> enum. */
OrderStatus statusFromString(const std::string& s);

}  // namespace nextra::ecommerce
