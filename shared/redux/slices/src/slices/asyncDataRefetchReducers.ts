/**
 * Extra reducers for refetch and cleanup thunks
 */

import type { ActionReducerMapBuilder } from '@reduxjs/toolkit'
import type { AsyncDataState } from './asyncDataTypes'
import {
  refetchAsyncData,
  cleanupAsyncRequests
} from './asyncDataThunks'

/**
 * Builds extra reducers for refetch thunk
 */
export const buildRefetchReducers = (
  builder: ActionReducerMapBuilder<AsyncDataState>
) => {
  builder
    .addCase(refetchAsyncData.pending, (state, action) => {
      const id =
        (action.meta.arg as any).id as string
      if (state.requests[id]) {
        state.requests[id].isRefetching = true
      }
    })
    .addCase(
      refetchAsyncData.fulfilled,
      (state, action) => {
        const { id, data } = action.payload
        if (state.requests[id]) {
          state.requests[id].data = data
          state.requests[id].status = 'succeeded'
          state.requests[id].error = null
          state.requests[id].isRefetching = false
          state.requests[id].lastRefetch = Date.now()
        }
      }
    )
    .addCase(
      refetchAsyncData.rejected,
      (state, action) => {
        const payload = action.payload as
          Record<string, string> | undefined
        const id = payload?.id
        if (id && state.requests[id]) {
          state.requests[id].isRefetching = false
          state.requests[id].error =
            payload.error || null
        }
      }
    )
}

/**
 * Builds extra reducers for cleanup thunk
 */
export const buildCleanupReducers = (
  builder: ActionReducerMapBuilder<AsyncDataState>
) => {
  builder.addCase(
    cleanupAsyncRequests.fulfilled,
    (state, action) => {
      const now = Date.now()
      const maxAge = action.payload.maxAge
      const idsToDelete: string[] = []

      for (const [id, request] of Object.entries(
        state.requests
      )) {
        const age = now - request.createdAt
        if (age > maxAge && request.status !== 'pending') {
          idsToDelete.push(id)
        }
      }

      idsToDelete.forEach((id) => {
        delete state.requests[id]
      })
    }
  )
}
