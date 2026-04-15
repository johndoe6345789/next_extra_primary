/**
 * @file ShopCheckout.cpp
 * @brief Checkout + order listing endpoints.
 */

#include "controllers/ShopController.h"
#include "controllers/shop_json.h"
#include "controllers/shop_services.h"
#include "utils/JsonResponse.h"

#include <algorithm>
#include <cctype>

using json = nlohmann::json;

namespace controllers
{

static std::int64_t userIdFrom(
    const drogon::HttpRequestPtr& req)
{
    auto s = req->attributes()->get<std::string>("user_id");
    try { return std::stoll(s); } catch (...) { return 0; }
}

void ShopController::checkout(const Req& req, Cb&& cb)
{
    auto order = shop::orders()->createFromCart(
        userIdFrom(req));
    if (order.totalCents <= 0) {
        cb(utils::jsonError(drogon::k400BadRequest,
                            "empty cart"));
        return;
    }
    std::string cur = order.currency;
    std::transform(cur.begin(), cur.end(), cur.begin(),
                   [](unsigned char c) {
                       return std::tolower(c);
                   });
    auto pi = shop::stripe()->createPaymentIntent(
        order.totalCents, cur);
    if (!pi) {
        cb(utils::jsonError(
            drogon::k502BadGateway,
            "stripe payment intent failed"));
        return;
    }
    shop::orders()->setStripePi(order.id, pi->id);
    json resp = shop::toJson(order);
    resp["stripe_pi"]             = pi->id;
    resp["stripe_client_secret"]  = pi->clientSecret;
    cb(utils::jsonOk(resp));
}

void ShopController::listOrders(const Req& req, Cb&& cb)
{
    auto os = shop::orders()->listForUser(userIdFrom(req));
    json items = json::array();
    for (const auto& o : os) items.push_back(shop::toJson(o));
    cb(utils::jsonOk({{"items", items}}));
}

void ShopController::adminListOrders(const Req&, Cb&& cb)
{
    auto os = shop::orders()->listAll(200);
    json items = json::array();
    for (const auto& o : os) items.push_back(shop::toJson(o));
    cb(utils::jsonOk({{"items", items}}));
}

}  // namespace controllers
