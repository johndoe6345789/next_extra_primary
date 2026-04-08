/**
 * Extra reducers for the fetch thunk
 */

import type { ActionReducerMapBuilder } from
  '@reduxjs/toolkit';
import type { AsyncDataState } from
  './asyncDataTypes';
import { createInitialRequest } from
  './asyncDataTypes';
import { fetchAsyncData } from './asyncDataThunks';

/** Rejected payload shape */
interface RejectedPayload {
  id: string;
  error: string;
}

/** Build fetch thunk extra reducers */
export function buildFetchReducers(
  builder: ActionReducerMapBuilder<AsyncDataState>
) {
  builder
    .addCase(
      fetchAsyncData.pending,
      (state, action) => {
        const id =
          (action.meta.arg as { id: string }).id;
        if (!state.requests[id]) {
          state.requests[id] =
            createInitialRequest(id);
        }
        state.requests[id].status = 'pending';
        state.requests[id].error = null;
      }
    )
    .addCase(
      fetchAsyncData.fulfilled,
      (state, action) => {
        const { id, data } = action.payload;
        if (!state.requests[id]) {
          state.requests[id] =
            createInitialRequest(id);
        }
        state.requests[id].status = 'succeeded';
        state.requests[id].data = data;
        state.requests[id].error = null;
        state.requests[id].lastRefetch =
          Date.now();
      }
    )
    .addCase(
      fetchAsyncData.rejected,
      (state, action) => {
        const p = action.payload as
          RejectedPayload | undefined;
        const id = p?.id;
        if (id) {
          if (!state.requests[id]) {
            state.requests[id] =
              createInitialRequest(id);
          }
          state.requests[id].status = 'failed';
          state.requests[id].error =
            p?.error || 'Unknown error';
          state.requests[id].retryCount += 1;
        }
      }
    );
}
