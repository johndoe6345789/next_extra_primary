#pragma once
/**
 * @file StripeClient.h
 * @brief Minimal Stripe REST client. Uses Drogon's
 *        HttpClient to call api.stripe.com with a
 *        Bearer secret key from env.
 */

#include <drogon/HttpClient.h>

#include <optional>
#include <string>

namespace nextra::ecommerce
{

/** Result of a PaymentIntent create call. */
struct PaymentIntentResult
{
    std::string id;            // pi_...
    std::string clientSecret;  // pi_..._secret_...
};

class StripeClient
{
  public:
    /**
     * @brief Construct from config.
     * @param apiBase e.g. "https://api.stripe.com"
     * @param secretKey Bearer key (sk_test_... / sk_live_...)
     */
    StripeClient(const std::string& apiBase,
                 const std::string& secretKey);

    /**
     * @brief Create a PaymentIntent.
     * @param amountCents amount in smallest currency unit.
     * @param currency ISO 4217 lowercase (e.g. "usd").
     * @return Stripe PI on success, nullopt on failure.
     */
    std::optional<PaymentIntentResult>
    createPaymentIntent(std::int64_t amountCents,
                        const std::string& currency);

  private:
    std::string                     apiBase_;
    std::string                     secretKey_;
    drogon::HttpClientPtr           client_;
};

}  // namespace nextra::ecommerce
