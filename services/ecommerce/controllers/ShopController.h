#pragma once
/**
 * @file ShopController.h
 * @brief REST endpoints for /api/shop/*. Split into
 *        catalog, cart, checkout, and webhook files
 *        to stay under the 100 LOC cap per file.
 */

#include <drogon/HttpController.h>

namespace controllers
{

class ShopController
    : public drogon::HttpController<ShopController>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(ShopController::listProducts,
        "/api/shop/products", drogon::Get);
    ADD_METHOD_TO(ShopController::getProduct,
        "/api/shop/products/{id}", drogon::Get);
    ADD_METHOD_TO(ShopController::createProduct,
        "/api/shop/products", drogon::Post,
        "filters::JwtAuthFilter");
    ADD_METHOD_TO(ShopController::updateProduct,
        "/api/shop/products/{id}", drogon::Put,
        "filters::JwtAuthFilter");
    ADD_METHOD_TO(ShopController::getCart,
        "/api/shop/cart", drogon::Get,
        "filters::JwtAuthFilter");
    ADD_METHOD_TO(ShopController::addToCart,
        "/api/shop/cart/items", drogon::Post,
        "filters::JwtAuthFilter");
    ADD_METHOD_TO(ShopController::setCartQty,
        "/api/shop/cart/items", drogon::Put,
        "filters::JwtAuthFilter");
    ADD_METHOD_TO(ShopController::checkout,
        "/api/shop/checkout", drogon::Post,
        "filters::JwtAuthFilter");
    ADD_METHOD_TO(ShopController::listOrders,
        "/api/shop/orders", drogon::Get,
        "filters::JwtAuthFilter");
    ADD_METHOD_TO(ShopController::adminListOrders,
        "/api/shop/admin/orders", drogon::Get,
        "filters::JwtAuthFilter");
    ADD_METHOD_TO(ShopController::stripeWebhook,
        "/api/stripe/webhook", drogon::Post);
    METHOD_LIST_END

    using Cb = std::function<void(
        const drogon::HttpResponsePtr&)>;
    using Req = drogon::HttpRequestPtr;

    void listProducts(const Req& req, Cb&& cb);
    void getProduct(const Req& req, Cb&& cb,
                    const std::string& id);
    void createProduct(const Req& req, Cb&& cb);
    void updateProduct(const Req& req, Cb&& cb,
                       const std::string& id);
    void getCart(const Req& req, Cb&& cb);
    void addToCart(const Req& req, Cb&& cb);
    void setCartQty(const Req& req, Cb&& cb);
    void checkout(const Req& req, Cb&& cb);
    void listOrders(const Req& req, Cb&& cb);
    void adminListOrders(const Req& req, Cb&& cb);
    void stripeWebhook(const Req& req, Cb&& cb);
};

}  // namespace controllers
