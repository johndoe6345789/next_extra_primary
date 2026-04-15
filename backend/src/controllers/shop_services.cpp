/**
 * @file shop_services.cpp
 * @brief Singleton wiring for ecommerce services
 *        consumed by the split ShopController files.
 */

#include "controllers/shop_services.h"

#include <drogon/drogon.h>
#include <cstdlib>
#include <fstream>
#include <nlohmann/json.hpp>

namespace
{

std::string env(const char* k, const char* def = "")
{
    const char* v = std::getenv(k);
    return v ? v : def;
}

nlohmann::json loadCfg()
{
    std::ifstream f("constants/ecommerce.json");
    if (!f) return {};
    nlohmann::json j;
    f >> j;
    return j;
}

}  // namespace

namespace controllers::shop
{

using namespace nextra::ecommerce;

std::shared_ptr<ProductStore> products()
{
    static auto inst = std::make_shared<ProductStore>(
        drogon::app().getDbClient());
    return inst;
}

std::shared_ptr<CartService> carts()
{
    static auto inst = std::make_shared<CartService>(
        drogon::app().getDbClient(), products());
    return inst;
}

std::shared_ptr<OrderService> orders()
{
    static auto inst = std::make_shared<OrderService>(
        drogon::app().getDbClient(), products(), carts());
    return inst;
}

std::shared_ptr<StripeClient> stripe()
{
    static auto cfg = loadCfg();
    static auto inst = std::make_shared<StripeClient>(
        cfg.value("stripeApiBase",
                  std::string{"https://api.stripe.com"}),
        env("STRIPE_SECRET_KEY"));
    return inst;
}

std::shared_ptr<StripeWebhook> webhook()
{
    static auto inst = std::make_shared<StripeWebhook>(
        orders(), env("STRIPE_WEBHOOK_SECRET"));
    return inst;
}

}  // namespace controllers::shop
