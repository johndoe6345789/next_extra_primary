/**
 * Extra reducers for mutate async thunk
 */

import type {
  ActionReducerMapBuilder,
} from '@reduxjs/toolkit';
import type {
  AsyncDataState,
} from './asyncDataTypes';
import { createInitialRequest } from
  './asyncDataTypes';
import { mutateAsyncData } from
  './asyncDataThunks';

/** Ensure request exists in state */
const ensureRequest = (
  state: AsyncDataState,
  id: string
) => {
  if (!state.requests[id]) {
    state.requests[id] = createInitialRequest(id);
  }
};

/** Builds extra reducers for mutate thunk */
export const buildMutateReducers = (
  builder: ActionReducerMapBuilder<
    AsyncDataState
  >
) => {
  builder
    .addCase(
      mutateAsyncData.pending,
      (state, action) => {
        const id = (action.meta.arg as
          any).id as string;
        ensureRequest(state, id);
        state.requests[id].status = 'pending';
        state.requests[id].error = null;
      }
    )
    .addCase(
      mutateAsyncData.fulfilled,
      (state, action) => {
        const { id, data } = action.payload;
        ensureRequest(state, id);
        state.requests[id].status = 'succeeded';
        state.requests[id].data = data;
        state.requests[id].error = null;
      }
    )
    .addCase(
      mutateAsyncData.rejected,
      (state, action) => {
        const payload = action.payload as
          Record<string, string> | undefined;
        const id = payload?.id;
        if (id) {
          ensureRequest(state, id);
          state.requests[id].status = 'failed';
          state.requests[id].error =
            payload.error || 'Unknown error';
        }
      }
    );
};
