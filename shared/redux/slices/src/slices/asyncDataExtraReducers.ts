/**
 * Extra reducers for async data thunks
 */

import type {
  ActionReducerMapBuilder,
} from '@reduxjs/toolkit';
import type { AsyncDataState } from
  './asyncDataTypes';
import { createInitialRequest } from
  './asyncDataTypes';
import { fetchAsyncData } from
  './asyncDataThunks';

export { buildMutateReducers } from
  './asyncDataMutateReducers';

/** Ensure request exists in state */
const ensureRequest = (
  state: AsyncDataState,
  id: string
) => {
  if (!state.requests[id]) {
    state.requests[id] =
      createInitialRequest(id);
  }
};

/** Builds extra reducers for fetch thunk */
export const buildFetchReducers = (
  builder: ActionReducerMapBuilder<
    AsyncDataState
  >
) => {
  builder
    .addCase(
      fetchAsyncData.pending,
      (state, action) => {
        const id = (action.meta.arg as
          any).id as string;
        ensureRequest(state, id);
        state.requests[id].status = 'pending';
        state.requests[id].error = null;
      }
    )
    .addCase(
      fetchAsyncData.fulfilled,
      (state, action) => {
        const { id, data } = action.payload;
        ensureRequest(state, id);
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
        const payload = action.payload as
          Record<string, string> | undefined;
        const id = payload?.id;
        if (id) {
          ensureRequest(state, id);
          state.requests[id].status = 'failed';
          state.requests[id].error =
            payload.error || 'Unknown error';
          state.requests[id].retryCount += 1;
        }
      }
    );
};
