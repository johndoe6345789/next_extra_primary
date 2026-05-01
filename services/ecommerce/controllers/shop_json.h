#pragma once
/**
 * @file shop_json.h
 * @brief JSON serialization helpers for ecommerce
 *        types shared across ShopController files.
 */

#include "ecommerce/backend/EcommerceTypes.h"

#include <nlohmann/json.hpp>
#include <iomanip>
#include <sstream>
#include <string>

namespace controllers::shop
{

/** Format price_cents as a display string e.g. "$9.99". */
inline std::string formatPrice(
    std::int32_t cents, const std::string& currency)
{
    const char* sym = currency == "USD" ? "$"
        : currency == "EUR" ? "€"
        : currency == "GBP" ? "£" : "";
    std::ostringstream os;
    os << sym
       << (cents / 100) << '.'
       << std::setw(2) << std::setfill('0')
       << (cents % 100);
    if (sym[0] == '\0') os << ' ' << currency;
    return os.str();
}

inline nlohmann::json toJson(
    const nextra::ecommerce::Product& p)
{
    return {
        {"id", p.id},
        {"sku", p.sku},
        {"slug", p.slug.empty() ? p.sku : p.slug},
        {"name", p.name},
        {"description", p.description},
        {"price_cents", p.priceCents},
        {"price_display", formatPrice(
            p.priceCents, p.currency)},
        {"currency", p.currency},
        {"stock", p.stock},
        {"image_url", p.imageUrl},
        {"active", p.active},
    };
}

inline nlohmann::json toJson(
    const nextra::ecommerce::Review& r)
{
    return {
        {"id", r.id},
        {"product_id", r.productId},
        {"author", r.author},
        {"rating", r.rating},
        {"body", r.body},
        {"created_at", r.createdAt},
    };
}

}  // namespace controllers::shop
