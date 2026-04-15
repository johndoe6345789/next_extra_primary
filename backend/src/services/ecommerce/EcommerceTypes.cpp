/**
 * @file EcommerceTypes.cpp
 * @brief Enum <-> string helpers for OrderStatus.
 */

#include "services/ecommerce/EcommerceTypes.h"

namespace nextra::ecommerce
{

std::string statusToString(OrderStatus s)
{
    switch (s) {
        case OrderStatus::Pending:   return "pending";
        case OrderStatus::Paid:      return "paid";
        case OrderStatus::Failed:    return "failed";
        case OrderStatus::Shipped:   return "shipped";
        case OrderStatus::Cancelled: return "cancelled";
    }
    return "pending";
}

OrderStatus statusFromString(const std::string& s)
{
    if (s == "paid")      return OrderStatus::Paid;
    if (s == "failed")    return OrderStatus::Failed;
    if (s == "shipped")   return OrderStatus::Shipped;
    if (s == "cancelled") return OrderStatus::Cancelled;
    return OrderStatus::Pending;
}

}  // namespace nextra::ecommerce
