#pragma once
/**
 * @file shop_json_tx.h
 * @brief Cart + Order JSON serializers — split from
 *        shop_json.h to keep both files under the
 *        100 LOC cap.
 */

#include "ecommerce/backend/EcommerceTypes.h"

#include <nlohmann/json.hpp>
#include <string>

namespace controllers::shop
{

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
