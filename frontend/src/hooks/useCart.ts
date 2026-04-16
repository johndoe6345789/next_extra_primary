'use client';

/**
 * Wraps RTK Query cart endpoints with optimistic
 * updates and syncs items into Redux cart slice.
 * @module hooks/useCart
 */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { setItems } from '@/store/slices/cartSlice';
import {
  useGetCartQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
} from '@/store/api/shopCartApi';
import type { CartItem } from '@/types/shop';

/** Return type for useCart. */
interface UseCartReturn {
  /** Current cart items. */
  items: CartItem[];
  /** Total number of items (sum of quantities). */
  itemCount: number;
  /** Whether the cart is loading. */
  isLoading: boolean;
  /** Add or increment a product in the cart. */
  addItem: (
    productId: string,
    quantity: number,
  ) => void;
  /** Update quantity of an existing cart item. */
  updateItem: (
    id: string,
    quantity: number,
  ) => void;
  /** Remove an item from the cart. */
  removeItem: (id: string) => void;
}

/**
 * Provides cart state and mutation helpers.
 * Syncs API data into the Redux cart slice for
 * badge count display.
 *
 * @returns Cart state and mutation actions.
 */
export function useCart(): UseCartReturn {
  const dispatch = useDispatch();
  const cachedItems = useSelector(
    (s: RootState) => s.cart.items,
  );

  const { data, isLoading } = useGetCartQuery();
  const [addCartItem] = useAddCartItemMutation();
  const [updateCartItem] =
    useUpdateCartItemMutation();
  const [removeCartItem] =
    useRemoveCartItemMutation();

  useEffect(() => {
    if (data) {
      dispatch(setItems(data.items));
    }
  }, [data, dispatch]);

  const items = data?.items ?? cachedItems;
  const itemCount = items.reduce(
    (sum, i) => sum + i.quantity,
    0,
  );

  return {
    items,
    itemCount,
    isLoading,
    addItem: (productId, quantity) => {
      addCartItem({ product_id: productId, quantity });
    },
    updateItem: (id, quantity) => {
      updateCartItem({ id, quantity });
    },
    removeItem: (id) => {
      removeCartItem(id);
    },
  };
}

export default useCart;
