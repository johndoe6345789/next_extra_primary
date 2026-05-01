/**
 * Shop products RTK Query endpoints.
 * @module store/api/shopProductsApi
 */
import { baseApi } from './baseApi';
import type {
  Product,
  ProductsResponse,
  ReviewsResponse,
} from '../../types/shop';

/** Product catalog endpoints. */
export const shopProductsApi =
  baseApi.injectEndpoints({
    endpoints: (build) => ({
      /** Fetch paginated product list. */
      getProducts: build.query<
        ProductsResponse,
        { page?: number; pageSize?: number }
      >({
        query: ({
          page = 1,
          pageSize = 12,
        }) =>
          `/shop/products?page=${page}` +
          `&page_size=${pageSize}`,
        providesTags: ['ShopProducts'],
      }),

      /** Fetch a single product by slug. */
      getProduct: build.query<Product, string>({
        query: (slug) =>
          `/shop/products/${slug}`,
        providesTags: ['ShopProducts'],
      }),

      /** Fetch reviews for a product by slug. */
      getProductReviews: build.query<
        ReviewsResponse, string
      >({
        query: (slug) =>
          `/shop/products/${slug}/reviews`,
        providesTags: ['ShopProducts'],
      }),
    }),
  });

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetProductReviewsQuery,
} = shopProductsApi;
