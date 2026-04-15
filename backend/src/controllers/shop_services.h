#pragma once
/**
 * @file shop_services.h
 * @brief Accessors to lazy-initialized ecommerce
 *        service singletons used by the split
 *        ShopController files.
 */

#include "services/ecommerce/CartService.h"
#include "services/ecommerce/OrderService.h"
#include "services/ecommerce/ProductStore.h"
#include "services/ecommerce/StripeClient.h"
#include "services/ecommerce/StripeWebhook.h"

#include <memory>

namespace controllers::shop
{

/** @brief Lazily-built product store. */
std::shared_ptr<nextra::ecommerce::ProductStore> products();

/** @brief Lazily-built cart service. */
std::shared_ptr<nextra::ecommerce::CartService> carts();

/** @brief Lazily-built order service. */
std::shared_ptr<nextra::ecommerce::OrderService> orders();

/** @brief Lazily-built Stripe REST client. */
std::shared_ptr<nextra::ecommerce::StripeClient> stripe();

/** @brief Lazily-built webhook verifier/dispatcher. */
std::shared_ptr<nextra::ecommerce::StripeWebhook> webhook();

}  // namespace controllers::shop
