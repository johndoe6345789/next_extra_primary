/**
 * Tests for useCheckout hook.
 * @module hooks/useCheckout.test
 */
import { renderHook, act } from
  '@testing-library/react';
import { useCheckout } from './useCheckout';

const mockCheckout = jest.fn();

jest.mock('@/store/api/shopCartApi', () => ({
  useCheckoutMutation: () => [
    mockCheckout,
    { isLoading: false, error: null },
  ],
}));

describe('useCheckout', () => {
  beforeEach(() => {
    mockCheckout.mockClear();
    Object.defineProperty(window, 'location', {
      value: { assign: jest.fn() },
      writable: true,
    });
  });

  it('calls checkout mutation on startCheckout', async () => {
    mockCheckout.mockResolvedValue({
      data: { stripe_url: 'https://stripe.com' },
    });
    const { result } = renderHook(
      () => useCheckout(),
    );
    await act(async () => {
      await result.current.startCheckout();
    });
    expect(mockCheckout).toHaveBeenCalledTimes(1);
  });

  it('redirects to stripe_url on success', async () => {
    mockCheckout.mockResolvedValue({
      data: {
        stripe_url: 'https://checkout.stripe.com/x',
      },
    });
    const { result } = renderHook(
      () => useCheckout(),
    );
    await act(async () => {
      await result.current.startCheckout();
    });
    expect(
      window.location.assign,
    ).toHaveBeenCalledWith(
      'https://checkout.stripe.com/x',
    );
  });

  it('returns error: null by default', () => {
    const { result } = renderHook(
      () => useCheckout(),
    );
    expect(result.current.error).toBeNull();
  });
});
