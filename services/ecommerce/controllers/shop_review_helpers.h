#pragma once
/**
 * @file shop_review_helpers.h
 * @brief Small inline helpers for the review-write
 *        controller (kept out of the .cpp to honor the
 *        100-LOC cap on each translation unit).
 */

#include "ecommerce/controllers/shop_review_validation.h"
#include "ecommerce/controllers/shop_search_emit.h"
#include "ecommerce/controllers/shop_services.h"

#include <drogon/HttpRequest.h>
#include <nlohmann/json.hpp>
#include <string>

namespace controllers::shop
{

/** @brief JWT sub of the caller (empty if missing). */
inline std::string callerSub(
    const drogon::HttpRequestPtr& req)
{
    return req->attributes()
        ->get<std::string>("user_id");
}

/** @brief JWT role of the caller (empty if missing). */
inline std::string callerRole(
    const drogon::HttpRequestPtr& req)
{
    return req->attributes()
        ->get<std::string>("user_role");
}

/**
 * @brief Re-emit the parent product upsert so the
 *        nextra-products index refreshes derived
 *        review aggregates.
 */
inline void reemitProduct(std::int64_t productId)
{
    auto p = products()->byId(productId);
    if (p) controllers::emitProduct(*p);
}

}  // namespace controllers::shop
