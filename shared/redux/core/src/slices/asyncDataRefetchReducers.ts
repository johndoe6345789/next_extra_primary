/**
 * Extra reducers for refetch thunk
 */

import type { ActionReducerMapBuilder } from
  '@reduxjs/toolkit';
import type { AsyncDataState } from
  './asyncDataTypes';
import { refetchAsyncData } from
  './asyncDataThunks';

export { buildCleanupReducers } from
  './asyncDataCleanupReducers';

/** Payload shape for rejected refetch */
interface RejectedPayload {
  id: string;
  error: string;
}

/** Build refetch thunk extra reducers */
export function buildRefetchReducers(
  builder: ActionReducerMapBuilder<AsyncDataState>
) {
  builder
    .addCase(
      refetchAsyncData.pending,
      (state, action) => {
        const id =
          (action.meta.arg as { id: string }).id;
        if (state.requests[id]) {
          state.requests[id].isRefetching = true;
        }
      }
    )
    .addCase(
      refetchAsyncData.fulfilled,
      (state, action) => {
        const { id, data } = action.payload;
        if (state.requests[id]) {
          state.requests[id].data = data;
          state.requests[id].status = 'succeeded';
          state.requests[id].error = null;
          state.requests[id].isRefetching = false;
          state.requests[id].lastRefetch =
            Date.now();
        }
      }
    )
    .addCase(
      refetchAsyncData.rejected,
      (state, action) => {
        const p = action.payload as
          RejectedPayload | undefined;
        const id = p?.id;
        if (id && state.requests[id]) {
          state.requests[id].isRefetching = false;
          state.requests[id].error =
            p?.error ?? null;
        }
      }
    );
}
