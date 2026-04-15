#pragma once
/**
 * @file shop_json.h
 * @brief JSON serialization helpers for ecommerce
 *        types shared across ShopController files.
 */

#include "ecommerce/backend/EcommerceTypes.h"

#include <nlohmann/json.hpp>

namespace controllers::shop
{

inline nlohmann::json toJson(
    const nextra::ecommerce::Product& p)
{
    return {
        {"id", p.id},
        {"sku", p.sku},
        {"name", p.name},
        {"description", p.description},
        {"price_cents", p.priceCents},
        {"currency", p.currency},
        {"stock", p.stock},
        {"active", p.active},
    };
}

inline nlohmann::json toJson(
    const nextra::ecommerce::Cart& c)
{
    nlohmann::json items = nlohmann::json::array();
    for (const auto& it : c.items) {
        items.push_back({
            {"product_id", it.productId},
            {"qty", it.qty},
        });
    }
    return {
        {"id", c.id},
        {"user_id", c.userId},
        {"items", items},
        {"total_cents", c.totalCents},
        {"currency", c.currency},
    };
}

inline nlohmann::json toJson(
    const nextra::ecommerce::Order& o)
{
    nlohmann::json lines = nlohmann::json::array();
    for (const auto& l : o.lines) {
        lines.push_back({
            {"product_id", l.productId},
            {"qty", l.qty},
            {"price_cents", l.priceCents},
        });
    }
    return {
        {"id", o.id},
        {"user_id", o.userId},
        {"status",
         nextra::ecommerce::statusToString(o.status)},
        {"total_cents", o.totalCents},
        {"currency", o.currency},
        {"stripe_pi",
         o.stripePi ? *o.stripePi : std::string{}},
        {"lines", lines},
    };
}

}  // namespace controllers::shop
