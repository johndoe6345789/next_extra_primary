/**
 * @file ShopReviewsDelete.cpp
 * @brief DELETE /api/shop/reviews/{rid} — owner or admin
 *        removes a review. Re-emits the parent product so
 *        derived fields refresh in the products index.
 */

#include "ecommerce/controllers/ShopController.h"
#include "ecommerce/controllers/shop_review_helpers.h"
#include "drogon-host/backend/utils/JsonResponse.h"

namespace controllers
{

void ShopController::deleteReview(
    const Req& req, Cb&& cb, const std::string& rid)
{
    try {
        const auto id = std::stoll(rid);
        auto cur = shop::reviews()->byId(id);
        if (!cur) {
            cb(utils::jsonError(drogon::k404NotFound,
                "review not found"));
            return;
        }
        const auto owner = shop::reviews()->ownerOf(id);
        const auto sub   = shop::callerSub(req);
        const auto role  = shop::callerRole(req);
        const bool isOwner =
            owner.has_value() && *owner == sub;
        if (!isOwner && role != "admin") {
            cb(utils::jsonError(drogon::k403Forbidden,
                "not your review"));
            return;
        }
        const auto productId = cur->productId;
        if (!shop::reviews()->deleteById(id)) {
            cb(utils::jsonError(drogon::k404NotFound,
                "review vanished"));
            return;
        }
        shop::reemitProduct(productId);
        cb(utils::jsonOk({{"deleted", true},
                          {"id", id}}));
    } catch (const std::exception& e) {
        cb(utils::jsonError(drogon::k400BadRequest,
                            e.what()));
    }
}

}  // namespace controllers
