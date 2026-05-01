/**
 * @file ShopReviews.cpp
 * @brief GET /api/shop/products/{id}/reviews — lists
 *        reviews for a product. {id} accepts numeric id
 *        or slug, matching the catalog routes.
 */

#include "ecommerce/controllers/ShopController.h"
#include "ecommerce/controllers/shop_json.h"
#include "ecommerce/controllers/shop_services.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <algorithm>
#include <cctype>

using json = nlohmann::json;

namespace controllers
{

void ShopController::listReviews(
    const Req&, Cb&& cb, const std::string& key)
{
    auto pStore = shop::products();
    std::optional<nextra::ecommerce::Product> p;
    const bool numeric =
        !key.empty()
        && std::all_of(key.begin(), key.end(),
            [](char c) { return std::isdigit(
                static_cast<unsigned char>(c)); });
    if (numeric) p = pStore->byId(std::stoll(key));
    else p = pStore->bySlug(key);
    if (!p) {
        cb(utils::jsonError(drogon::k404NotFound,
                            "product not found"));
        return;
    }
    auto rows = shop::reviews()->listForProduct(p->id);
    json items = json::array();
    for (const auto& r : rows)
        items.push_back(shop::toJson(r));
    cb(utils::jsonOk({{"items", items}}));
}

}  // namespace controllers
