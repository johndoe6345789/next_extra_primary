#pragma once
/**
 * @file StripeWebhook.h
 * @brief Stripe webhook signature verifier + event
 *        dispatcher. Handles payment_intent.succeeded
 *        and payment_intent.payment_failed.
 */

#include "services/ecommerce/OrderService.h"

#include <memory>
#include <string>

namespace nextra::ecommerce
{

class StripeWebhook
{
  public:
    StripeWebhook(std::shared_ptr<OrderService> orders,
                  const std::string& signingSecret);

    /**
     * @brief Verify the Stripe-Signature header.
     * @param payload Raw request body.
     * @param sigHeader The full "Stripe-Signature" header.
     * @return true if signature matches secret.
     */
    bool verify(const std::string& payload,
                const std::string& sigHeader) const;

    /**
     * @brief Dispatch a verified event JSON body.
     * @return true if handled (even if no-op).
     */
    bool dispatch(const std::string& payload);

  private:
    std::shared_ptr<OrderService> orders_;
    std::string                   secret_;
};

}  // namespace nextra::ecommerce
