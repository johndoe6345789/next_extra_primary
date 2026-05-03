#pragma once
/**
 * @file shop_search_emit.h
 * @brief One-line search.reindex emitters used by
 *        ShopCatalog* controllers. Header-only so
 *        each controller stays under the 100-LOC
 *        cap.
 */

#include "ecommerce/backend/EcommerceTypes.h"
#include "search/events/SearchEventPublisher.h"

#include <string>

namespace controllers
{

/// Emit an upsert for one product row.
inline void emitProduct(
    const nextra::ecommerce::Product& p)
{
    nextra::search::SearchEventPublisher::publish(
        "upsert", "products",
        std::to_string(p.id),
        {{"sku", p.sku}, {"name", p.name},
         {"description", p.description},
         {"active", p.active}});
}

} // namespace controllers
