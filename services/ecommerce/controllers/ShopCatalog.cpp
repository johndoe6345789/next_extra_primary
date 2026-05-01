/**
 * @file ShopCatalog.cpp
 * @brief Catalog read + create endpoints. Updates
 *        live in ShopCatalogWrite.cpp.
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

void ShopController::listProducts(const Req& req, Cb&& cb)
{
    int page = 1;
    int pageSize = 12;
    try {
        auto p = req->getParameter("page");
        if (!p.empty()) page = std::stoi(p);
        auto ps = req->getParameter("page_size");
        if (!ps.empty()) pageSize = std::stoi(ps);
    } catch (...) { /* keep defaults */ }
    if (page < 1) page = 1;
    if (pageSize < 1 || pageSize > 100) pageSize = 12;

    auto store = shop::products();
    auto rows = store->listActivePaged(
        pageSize, (page - 1) * pageSize);
    json items = json::array();
    for (const auto& p : rows)
        items.push_back(shop::toJson(p));
    cb(utils::jsonOk({
        {"items", items},
        {"total", store->countActive()},
        {"page", page},
    }));
}

void ShopController::getProduct(
    const Req&, Cb&& cb, const std::string& key)
{
    auto store = shop::products();
    // Accept numeric id or slug — frontend uses slug,
    // admin tooling uses id.
    std::optional<nextra::ecommerce::Product> p;
    const bool numeric =
        !key.empty()
        && std::all_of(key.begin(), key.end(),
            [](char c) { return std::isdigit(
                static_cast<unsigned char>(c)); });
    if (numeric) p = store->byId(std::stoll(key));
    else p = store->bySlug(key);
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
        p.slug        = body.value("slug", p.sku);
        p.name        = body.at("name").get<std::string>();
        p.description = body.value("description",
                                    std::string{});
        p.priceCents  = body.at("price_cents")
                            .get<std::int32_t>();
        p.currency    = body.value("currency",
                                    std::string{"USD"});
        p.stock       = body.value("stock", 0);
        p.imageUrl    = body.value("image_url",
                                    std::string{});
        p.active      = body.value("active", true);
        p.id = shop::products()->insert(p);
        cb(utils::jsonCreated(shop::toJson(p)));
    } catch (const std::exception& e) {
        cb(utils::jsonError(drogon::k400BadRequest,
                            e.what()));
    }
}

}  // namespace controllers
