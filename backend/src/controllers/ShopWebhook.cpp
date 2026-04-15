/**
 * @file ShopWebhook.cpp
 * @brief Stripe webhook endpoint. Verifies signature
 *        then dispatches to StripeWebhook handlers.
 *        Must NOT require auth — Stripe posts directly.
 */

#include "controllers/ShopController.h"
#include "controllers/shop_services.h"
#include "utils/JsonResponse.h"

namespace controllers
{

void ShopController::stripeWebhook(const Req& req, Cb&& cb)
{
    auto body = std::string{req->body()};
    auto sig  = req->getHeader("Stripe-Signature");
    auto wh   = shop::webhook();
    if (!wh->verify(body, sig)) {
        cb(utils::jsonError(drogon::k400BadRequest,
                            "bad signature"));
        return;
    }
    if (!wh->dispatch(body)) {
        cb(utils::jsonError(drogon::k400BadRequest,
                            "bad payload"));
        return;
    }
    cb(utils::jsonOk({{"received", true}}));
}

}  // namespace controllers
