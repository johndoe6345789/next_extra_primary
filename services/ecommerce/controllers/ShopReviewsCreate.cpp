/**
 * @file ShopReviewsCreate.cpp
 * @brief POST /api/shop/products/{id}/reviews — auth'd
 *        upsert of a review by (product, user). Re-emits
 *        the parent product to nextra-products.
 */

#include "ecommerce/controllers/ShopController.h"
#include "ecommerce/controllers/shop_json.h"
#include "ecommerce/controllers/shop_review_helpers.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <algorithm>
#include <cctype>

using json = nlohmann::json;

namespace controllers
{

void ShopController::createReview(
    const Req& req, Cb&& cb, const std::string& id)
{
    try {
        auto body =
            json::parse(std::string{req->body()});
        if (!shop::validRating(body.value(
                "rating", json{}))) {
            cb(utils::jsonError(drogon::k400BadRequest,
                "rating must be integer 1..5"));
            return;
        }
        if (!shop::validBody(body.value("body", json{}))) {
            cb(utils::jsonError(drogon::k400BadRequest,
                "body must be 1..5000 chars"));
            return;
        }
        std::optional<nextra::ecommerce::Product> p;
        const bool numeric = !id.empty()
            && std::all_of(id.begin(), id.end(),
                [](char c) { return std::isdigit(
                    static_cast<unsigned char>(c)); });
        if (numeric)
            p = shop::products()->byId(std::stoll(id));
        else
            p = shop::products()->bySlug(id);
        if (!p) {
            cb(utils::jsonError(drogon::k404NotFound,
                "product not found"));
            return;
        }
        const auto sub = shop::callerSub(req);
        const auto rating =
            body["rating"].get<std::int32_t>();
        const auto txt =
            body["body"].get<std::string>();
        auto r = shop::reviews()->upsertForUser(
            p->id, sub, sub, rating, txt);
        shop::reemitProduct(p->id);
        cb(utils::jsonOk(shop::toJson(r)));
    } catch (const std::exception& e) {
        cb(utils::jsonError(drogon::k400BadRequest,
                            e.what()));
    }
}

}  // namespace controllers
