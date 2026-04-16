'use client';

/**
 * Wraps RTK Query product list endpoint.
 * @module hooks/useShopProducts
 */
import { useState } from 'react';
import {
  useGetProductsQuery,
} from '@/store/api/shopProductsApi';
import type { Product } from '@/types/shop';

/** Return type for useShopProducts. */
interface UseShopProductsReturn {
  /** Products for the current page. */
  products: Product[];
  /** Total number of products. */
  total: number;
  /** Current page number (1-based). */
  page: number;
  /** Set the current page. */
  setPage: (p: number) => void;
  /** Whether data is loading. */
  isLoading: boolean;
}

/**
 * Provides a paginated product list.
 *
 * @param pageSize - Items per page.
 * @returns Product list state and pagination.
 */
export function useShopProducts(
  pageSize = 12,
): UseShopProductsReturn {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetProductsQuery(
    { page, pageSize },
  );

  return {
    products: data?.items ?? [],
    total: data?.total ?? 0,
    page,
    setPage,
    isLoading,
  };
}

export default useShopProducts;
