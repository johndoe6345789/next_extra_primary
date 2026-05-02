/**
 * Shop review write RTK Query mutations.
 * Read endpoints live in shopProductsApi.ts.
 * @module store/api/shopReviewsApi
 */
import { baseApi } from './baseApi';

/** Body for create review POST. */
export interface CreateReviewBody {
  /** Product slug or numeric id. */
  productKey: string;
  /** Star rating, 1..5. */
  rating: number;
  /** Free-text body, 1..5000 chars. */
  body: string;
}

/** Body for PATCH review. */
export interface UpdateReviewBody {
  /** Review id. */
  id: number;
  /** Optional new rating. */
  rating?: number;
  /** Optional new body. */
  body?: string;
}

/** Review write endpoints. */
export const shopReviewsApi =
  baseApi.injectEndpoints({
    endpoints: (build) => ({
      /** Create or upsert a review for a product. */
      createReview: build.mutation<
        unknown, CreateReviewBody
      >({
        query: ({ productKey, rating, body }) => ({
          url:
            `/shop/products/${productKey}/reviews`,
          method: 'POST',
          body: { rating, body },
        }),
        invalidatesTags: ['ShopProducts'],
      }),

      /** Patch a review (owner or admin only). */
      updateReview: build.mutation<
        unknown, UpdateReviewBody
      >({
        query: ({ id, rating, body }) => ({
          url: `/shop/reviews/${id}`,
          method: 'PATCH',
          body: { rating, body },
        }),
        invalidatesTags: ['ShopProducts'],
      }),

      /** Delete a review (owner or admin only). */
      deleteReview: build.mutation<unknown, number>({
        query: (id) => ({
          url: `/shop/reviews/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['ShopProducts'],
      }),
    }),
  });

export const {
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = shopReviewsApi;
