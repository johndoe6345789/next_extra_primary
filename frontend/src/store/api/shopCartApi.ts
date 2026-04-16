/**
 * Shop cart RTK Query endpoints.
 * @module store/api/shopCartApi
 */
import { baseApi } from './baseApi';
import type { Cart } from '../../types/shop';

/** Cart CRUD endpoints. */
export const shopCartApi =
  baseApi.injectEndpoints({
    endpoints: (build) => ({
      /** Fetch the current cart. */
      getCart: build.query<Cart, void>({
        query: () => '/shop/cart',
        providesTags: ['Cart'],
      }),

      /** Add an item to the cart. */
      addCartItem: build.mutation<
        Cart,
        { product_id: string; quantity: number }
      >({
        query: (body) => ({
          url: '/shop/cart/items',
          method: 'POST',
          body,
        }),
        invalidatesTags: ['Cart'],
      }),

      /** Update a cart item quantity. */
      updateCartItem: build.mutation<
        Cart,
        { id: string; quantity: number }
      >({
        query: ({ id, quantity }) => ({
          url: `/shop/cart/items/${id}`,
          method: 'PATCH',
          body: { quantity },
        }),
        invalidatesTags: ['Cart'],
      }),

      /** Remove a cart item. */
      removeCartItem: build.mutation<
        void, string
      >({
        query: (id) => ({
          url: `/shop/cart/items/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Cart'],
      }),

      /** Start Stripe checkout. */
      checkout: build.mutation<
        { stripe_url: string }, void
      >({
        query: () => ({
          url: '/shop/checkout',
          method: 'POST',
        }),
      }),
    }),
  });

export const {
  useGetCartQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useCheckoutMutation,
} = shopCartApi;
