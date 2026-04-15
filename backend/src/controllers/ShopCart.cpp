/**
 * @file ShopCart.cpp
 * @brief Cart GET/POST/PUT endpoints for the
 *        ShopController.
 */

#include "controllers/ShopController.h"
#include "controllers/shop_json.h"
#include "controllers/shop_services.h"
#include "utils/JsonResponse.h"

using json = nlohmann::json;

namespace controllers
{

static std::int64_t userIdFrom(
    const drogon::HttpRequestPtr& req)
{
    auto s = req->attributes()->get<std::string>("user_id");
    try {
        return std::stoll(s);
    } catch (...) {
        return 0;
    }
}

void ShopController::getCart(const Req& req, Cb&& cb)
{
    auto c = shop::carts()->getOrCreate(userIdFrom(req));
    cb(utils::jsonOk(shop::toJson(c)));
}

void ShopController::addToCart(const Req& req, Cb&& cb)
{
    try {
        auto body = json::parse(std::string{req->body()});
        auto pid  = body.at("product_id")
                        .get<std::int64_t>();
        auto qty  = body.value("qty", 1);
        auto c = shop::carts()->addItem(
            userIdFrom(req), pid, qty);
        cb(utils::jsonOk(shop::toJson(c)));
    } catch (const std::exception& e) {
        cb(utils::jsonError(drogon::k400BadRequest,
                            e.what()));
    }
}

void ShopController::setCartQty(const Req& req, Cb&& cb)
{
    try {
        auto body = json::parse(std::string{req->body()});
        auto pid  = body.at("product_id")
                        .get<std::int64_t>();
        auto qty  = body.at("qty").get<std::int32_t>();
        auto c = shop::carts()->setQty(
            userIdFrom(req), pid, qty);
        cb(utils::jsonOk(shop::toJson(c)));
    } catch (const std::exception& e) {
        cb(utils::jsonError(drogon::k400BadRequest,
                            e.what()));
    }
}

}  // namespace controllers
