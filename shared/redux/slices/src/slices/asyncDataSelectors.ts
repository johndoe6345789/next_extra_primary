/**
 * Selectors for async data state
 */

import type { AsyncDataState } from './asyncDataTypes'

/**
 * Selector: Get specific async request by ID
 */
export const selectAsyncRequest = (
  state: { asyncData: AsyncDataState },
  id: string
) => state.asyncData.requests[id]

/**
 * Selector: Get data from specific async request
 */
export const selectAsyncData = (
  state: { asyncData: AsyncDataState },
  id: string
) => state.asyncData.requests[id]?.data

/**
 * Selector: Get error from specific async request
 */
export const selectAsyncError = (
  state: { asyncData: AsyncDataState },
  id: string
) => state.asyncData.requests[id]?.error

/**
 * Selector: Check if specific request is loading
 */
export const selectAsyncLoading = (
  state: { asyncData: AsyncDataState },
  id: string
) => state.asyncData.requests[id]?.status === 'pending'

/**
 * Selector: Check if specific request is refetching
 */
export const selectAsyncRefetching = (
  state: { asyncData: AsyncDataState },
  id: string
) => state.asyncData.requests[id]?.isRefetching ?? false

/**
 * Selector: Get all requests
 */
export const selectAllAsyncRequests = (
  state: { asyncData: AsyncDataState }
) => state.asyncData.requests

/**
 * Selector: Get global loading state
 */
export const selectGlobalLoading = (
  state: { asyncData: AsyncDataState }
) => state.asyncData.globalLoading

/**
 * Selector: Get global error state
 */
export const selectGlobalError = (
  state: { asyncData: AsyncDataState }
) => state.asyncData.globalError
