/**
 * @file ShopCatalogWrite.cpp
 * @brief Product update endpoint (split from
 *        ShopCatalog.cpp for the 100 LOC cap).
 */

#include "ecommerce/controllers/ShopController.h"
#include "ecommerce/controllers/shop_json.h"
#include "ecommerce/controllers/shop_services.h"
#include "drogon-host/backend/utils/JsonResponse.h"

using json = nlohmann::json;

namespace controllers
{

void ShopController::updateProduct(
    const Req& req, Cb&& cb, const std::string& id)
{
    try {
        auto body =
            json::parse(std::string{req->body()});
        auto cur = shop::products()->byId(std::stoll(id));
        if (!cur) {
            cb(utils::jsonError(drogon::k404NotFound,
                                "product not found"));
            return;
        }
        cur->name = body.value("name", cur->name);
        cur->description =
            body.value("description", cur->description);
        cur->priceCents =
            body.value("price_cents", cur->priceCents);
        cur->stock  = body.value("stock", cur->stock);
        cur->active = body.value("active", cur->active);
        shop::products()->update(*cur);
        cb(utils::jsonOk(shop::toJson(*cur)));
    } catch (const std::exception& e) {
        cb(utils::jsonError(drogon::k400BadRequest,
                            e.what()));
    }
}

}  // namespace controllers
