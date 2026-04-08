/**
 * Synchronous reducers for async data slice
 */

import type { PayloadAction } from '@reduxjs/toolkit'
import type { AsyncDataState } from './asyncDataTypes'
import { createInitialRequest } from './asyncDataTypes'

/** Ensure request exists in state */
const ensure = (
  state: AsyncDataState, id: string
) => {
  if (!state.requests[id]) {
    state.requests[id] = createInitialRequest(id)
  }
}

/** Set request to loading state */
export const setRequestLoadingReducer = (
  state: AsyncDataState,
  action: PayloadAction<string>
) => {
  ensure(state, action.payload)
  state.requests[action.payload].status = 'pending'
  state.requests[action.payload].error = null
}

/** Set request error */
export const setRequestErrorReducer = (
  state: AsyncDataState,
  action: PayloadAction<{
    id: string; error: string
  }>
) => {
  ensure(state, action.payload.id)
  state.requests[action.payload.id].status = 'failed'
  state.requests[action.payload.id].error =
    action.payload.error
}

/** Set request data */
export const setRequestDataReducer = (
  state: AsyncDataState,
  action: PayloadAction<{
    id: string; data: unknown
  }>
) => {
  ensure(state, action.payload.id)
  const req = state.requests[action.payload.id]
  req.data = action.payload.data
  req.status = 'succeeded'
  req.error = null
}

/** Reset request to idle */
export const resetRequestReducer = (
  state: AsyncDataState,
  action: PayloadAction<string>
) => {
  if (state.requests[action.payload]) {
    state.requests[action.payload] =
      createInitialRequest(action.payload)
  }
}

/** Set refetch interval */
export const setRefetchIntervalReducer = (
  state: AsyncDataState,
  action: PayloadAction<{
    id: string; interval: number | null
  }>
) => {
  ensure(state, action.payload.id)
  state.requests[action.payload.id]
    .refetchInterval = action.payload.interval
}
