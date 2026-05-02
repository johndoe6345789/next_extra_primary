#pragma once
/**
 * @file shop_review_validation.h
 * @brief Pure validation helpers for the review write
 *        endpoints. Header-only and Drogon-free so the
 *        unit tests can include this without dragging
 *        in the entire shop service stack.
 */

#include <nlohmann/json.hpp>
#include <string>

namespace controllers::shop
{

/** @brief True iff rating is a JSON integer in [1,5]. */
inline bool validRating(const nlohmann::json& v)
{
    if (!v.is_number_integer()) return false;
    auto n = v.get<long long>();
    return n >= 1 && n <= 5;
}

/** @brief True iff body is a 1..5000 char JSON string. */
inline bool validBody(const nlohmann::json& v)
{
    if (!v.is_string()) return false;
    auto s = v.get_ref<const std::string&>();
    return !s.empty() && s.size() <= 5000;
}

}  // namespace controllers::shop
