/**
 * @file ShopCatalog.cpp
 * @brief Catalog read + create endpoints. Updates
 *        live in ShopCatalogWrite.cpp.
 */

#include "ecommerce/controllers/ShopController.h"
#include "ecommerce/controllers/shop_json.h"
#include "ecommerce/controllers/shop_services.h"
#include "drogon-host/backend/utils/JsonResponse.h"

using json = nlohmann::json;

namespace controllers
{

void ShopController::listProducts(const Req&, Cb&& cb)
{
    auto ps = shop::products()->listActive();
    json items = json::array();
    for (const auto& p : ps) items.push_back(shop::toJson(p));
    cb(utils::jsonOk({{"items", items}}));
}

void ShopController::getProduct(
    const Req&, Cb&& cb, const std::string& id)
{
    auto p = shop::products()->byId(std::stoll(id));
    if (!p) {
        cb(utils::jsonError(drogon::k404NotFound,
                            "product not found"));
        return;
    }
    cb(utils::jsonOk(shop::toJson(*p)));
}

void ShopController::createProduct(
    const Req& req, Cb&& cb)
{
    try {
        auto body =
            json::parse(std::string{req->body()});
        nextra::ecommerce::Product p;
        p.sku         = body.at("sku").get<std::string>();
        p.name        = body.at("name").get<std::string>();
        p.description = body.value("description",
                                    std::string{});
        p.priceCents  = body.at("price_cents")
                            .get<std::int32_t>();
        p.currency    = body.value("currency",
                                    std::string{"USD"});
        p.stock       = body.value("stock", 0);
        p.active      = body.value("active", true);
        p.id = shop::products()->insert(p);
        cb(utils::jsonCreated(shop::toJson(p)));
    } catch (const std::exception& e) {
        cb(utils::jsonError(drogon::k400BadRequest,
                            e.what()));
    }
}

}  // namespace controllers
