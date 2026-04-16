/**
 * Shop orders RTK Query endpoints.
 * @module store/api/shopOrdersApi
 */
import { baseApi } from './baseApi';
import type { Order } from '../../types/shop';

/** Order history endpoints. */
export const shopOrdersApi =
  baseApi.injectEndpoints({
    endpoints: (build) => ({
      /** Fetch the current user's order list. */
      getOrders: build.query<Order[], void>({
        query: () => '/shop/orders',
        providesTags: ['Orders'],
      }),

      /** Fetch a single order by ID. */
      getOrder: build.query<Order, string>({
        query: (id) =>
          `/shop/orders/${id}`,
        providesTags: ['Orders'],
      }),
    }),
  });

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
} = shopOrdersApi;
