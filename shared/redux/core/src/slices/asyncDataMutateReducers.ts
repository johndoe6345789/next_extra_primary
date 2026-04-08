/**
 * Extra reducers for the mutate thunk
 */

import type { ActionReducerMapBuilder } from
  '@reduxjs/toolkit';
import type { AsyncDataState } from
  './asyncDataTypes';
import { createInitialRequest } from
  './asyncDataTypes';
import { mutateAsyncData } from
  './asyncDataThunks';

/** Rejected payload shape */
interface RejectedPayload {
  id: string;
  error: string;
}

/** Build mutate thunk extra reducers */
export function buildMutateReducers(
  builder: ActionReducerMapBuilder<AsyncDataState>
) {
  builder
    .addCase(
      mutateAsyncData.pending,
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
      mutateAsyncData.fulfilled,
      (state, action) => {
        const { id, data } = action.payload;
        if (!state.requests[id]) {
          state.requests[id] =
            createInitialRequest(id);
        }
        state.requests[id].status = 'succeeded';
        state.requests[id].data = data;
        state.requests[id].error = null;
      }
    )
    .addCase(
      mutateAsyncData.rejected,
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
        }
      }
    );
}
