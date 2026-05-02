/**
 * @file ShopReviewsUpdate.cpp
 * @brief PATCH /api/shop/reviews/{rid} — owner or admin
 *        edits rating/body. Re-emits the parent product.
 */

#include "ecommerce/controllers/ShopController.h"
#include "ecommerce/controllers/shop_json.h"
#include "ecommerce/controllers/shop_review_helpers.h"
#include "drogon-host/backend/utils/JsonResponse.h"

using json = nlohmann::json;

namespace controllers
{

void ShopController::updateReview(
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
        auto body =
            json::parse(std::string{req->body()});
        std::int32_t rating = cur->rating;
        std::string  txt    = cur->body;
        if (body.contains("rating")) {
            if (!shop::validRating(body["rating"])) {
                cb(utils::jsonError(
                    drogon::k400BadRequest,
                    "rating must be integer 1..5"));
                return;
            }
            rating = body["rating"].get<std::int32_t>();
        }
        if (body.contains("body")) {
            if (!shop::validBody(body["body"])) {
                cb(utils::jsonError(
                    drogon::k400BadRequest,
                    "body must be 1..5000 chars"));
                return;
            }
            txt = body["body"].get<std::string>();
        }
        auto upd = shop::reviews()->updateById(
            id, rating, txt);
        if (!upd) {
            cb(utils::jsonError(drogon::k404NotFound,
                "review vanished"));
            return;
        }
        shop::reemitProduct(upd->productId);
        cb(utils::jsonOk(shop::toJson(*upd)));
    } catch (const std::exception& e) {
        cb(utils::jsonError(drogon::k400BadRequest,
                            e.what()));
    }
}

}  // namespace controllers
