/**
 * Inline reducers for asyncData slice
 */

import type { PayloadAction } from
  '@reduxjs/toolkit';
import type { AsyncDataState } from
  './asyncDataTypes';
import { createInitialRequest } from
  './asyncDataTypes';

/** Ensure request exists, then return it */
function ensureReq(
  state: AsyncDataState, id: string
) {
  if (!state.requests[id]) {
    state.requests[id] =
      createInitialRequest(id);
  }
  return state.requests[id];
}

/** Set a request to loading state */
export const setRequestLoadingReducer = (
  state: AsyncDataState,
  action: PayloadAction<string>
) => {
  const req = ensureReq(state, action.payload);
  req.status = 'pending';
  req.error = null;
};

/** Set a request error */
export const setRequestErrorReducer = (
  state: AsyncDataState,
  action: PayloadAction<{
    id: string; error: string;
  }>
) => {
  const req = ensureReq(
    state, action.payload.id
  );
  req.status = 'failed';
  req.error = action.payload.error;
};

/** Set request data */
export const setRequestDataReducer = (
  state: AsyncDataState,
  action: PayloadAction<{
    id: string; data: unknown;
  }>
) => {
  const req = ensureReq(
    state, action.payload.id
  );
  req.data = action.payload.data;
  req.status = 'succeeded';
  req.error = null;
};

/** Reset a request to initial state */
export const resetRequestReducer = (
  state: AsyncDataState,
  action: PayloadAction<string>
) => {
  if (state.requests[action.payload]) {
    state.requests[action.payload] =
      createInitialRequest(action.payload);
  }
};

/** Set refetch interval on a request */
export const setRefetchIntervalReducer = (
  state: AsyncDataState,
  action: PayloadAction<{
    id: string; interval: number | null;
  }>
) => {
  const req = ensureReq(
    state, action.payload.id
  );
  req.refetchInterval = action.payload.interval;
};
