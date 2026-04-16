/**
 * Tests for useCart hook.
 * @module hooks/useCart.test
 */
import { renderHook } from '@testing-library/react';
import { useCart } from './useCart';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: () => [],
}));

jest.mock('@/store/api/shopCartApi', () => ({
  useGetCartQuery: () => ({
    data: {
      items: [
        {
          id: 'ci1',
          product: {
            id: 'p1',
            price_cents: 500,
            name: 'Widget',
          },
          quantity: 2,
        },
      ],
    },
    isLoading: false,
  }),
  useAddCartItemMutation: () => [jest.fn()],
  useUpdateCartItemMutation: () => [jest.fn()],
  useRemoveCartItemMutation: () => [jest.fn()],
}));

jest.mock('@/store/slices/cartSlice', () => ({
  setItems: (items: unknown) => ({
    type: 'cart/setItems',
    payload: items,
  }),
}));

describe('useCart', () => {
  it('returns items from API', () => {
    const { result } = renderHook(() => useCart());
    expect(result.current.items).toHaveLength(1);
    expect(
      result.current.items[0]?.product.name,
    ).toBe('Widget');
  });

  it('computes itemCount as sum of quantities', () => {
    const { result } = renderHook(() => useCart());
    expect(result.current.itemCount).toBe(2);
  });

  it('exposes addItem, updateItem, removeItem', () => {
    const { result } = renderHook(() => useCart());
    expect(
      typeof result.current.addItem,
    ).toBe('function');
    expect(
      typeof result.current.updateItem,
    ).toBe('function');
    expect(
      typeof result.current.removeItem,
    ).toBe('function');
  });
});
