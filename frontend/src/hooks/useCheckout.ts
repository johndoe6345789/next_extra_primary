'use client';

/**
 * Hook for triggering Stripe checkout.
 * @module hooks/useCheckout
 */
import { useCheckoutMutation } from
  '@/store/api/shopCartApi';

/** Return type for useCheckout. */
interface UseCheckoutReturn {
  /** Trigger checkout and redirect to Stripe. */
  startCheckout: () => Promise<void>;
  /** Whether checkout is in progress. */
  isLoading: boolean;
  /** Error message if checkout failed. */
  error: string | null;
}

/**
 * Initiates Stripe checkout via the API and
 * redirects the browser to the returned URL.
 *
 * @returns Checkout trigger, loading, and error.
 */
export function useCheckout(): UseCheckoutReturn {
  const [checkout, { isLoading, error }] =
    useCheckoutMutation();

  const startCheckout = async () => {
    const result = await checkout();
    if ('data' in result && result.data) {
      window.location.assign(
        result.data.stripe_url,
      );
    }
  };

  const errorMsg =
    error && 'error' in error
      ? String(error.error)
      : null;

  return {
    startCheckout,
    isLoading,
    error: errorMsg,
  };
}

export default useCheckout;
