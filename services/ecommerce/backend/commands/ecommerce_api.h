#pragma once
/**
 * @file ecommerce_api.h
 * @brief CLI subcommand entry for the ecommerce
 *        daemon (products, carts, orders, Stripe).
 */

#include <string>

namespace commands
{

/**
 * @brief Run the ecommerce-api daemon.
 * @param config Path to Drogon JSON config.
 */
void cmdEcommerceApi(const std::string& config);

}  // namespace commands
