/**
 * Cart slice — client-side cart drawer state.
 * Backend is source of truth; slice caches items
 * for badge count + drawer open state.
 * @module store/slices/cartSlice
 */
import {
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type { CartItem } from '../../types/shop';

/** Cart UI state shape. */
interface CartState {
  /** Cached cart items for badge display. */
  items: CartItem[];
  /** Whether the cart drawer is open. */
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /** Open the cart drawer. */
    openCart(state) {
      state.isOpen = true;
    },
    /** Close the cart drawer. */
    closeCart(state) {
      state.isOpen = false;
    },
    /** Replace cached items from API response. */
    setItems(
      state,
      action: PayloadAction<CartItem[]>,
    ) {
      state.items = action.payload;
    },
  },
});

export const { openCart, closeCart, setItems } =
  cartSlice.actions;

export default cartSlice.reducer;
