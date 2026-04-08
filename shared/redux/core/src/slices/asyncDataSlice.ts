/**
 * Redux Slice for Generic Async Data Management
 */

import { createSlice, PayloadAction } from
  '@reduxjs/toolkit';
import { asyncDataInitialState } from
  './asyncDataTypes';
import {
  setRequestLoadingReducer,
  setRequestErrorReducer,
  setRequestDataReducer,
  resetRequestReducer,
  setRefetchIntervalReducer,
} from './asyncDataReducers';
import {
  buildFetchReducers, buildMutateReducers,
} from './asyncDataExtraReducers';
import {
  buildRefetchReducers, buildCleanupReducers,
} from './asyncDataRefetchReducers';

export type {
  AsyncRequest, AsyncDataState,
} from './asyncDataTypes';
export {
  fetchAsyncData, mutateAsyncData,
  refetchAsyncData, cleanupAsyncRequests,
} from './asyncDataThunks';

export const asyncDataSlice = createSlice({
  name: 'asyncData',
  initialState: asyncDataInitialState,
  reducers: {
    setRequestLoading: setRequestLoadingReducer,
    setRequestError: setRequestErrorReducer,
    setRequestData: setRequestDataReducer,
    clearRequest: (
      state, action: PayloadAction<string>
    ) => { delete state.requests[action.payload]; },
    clearAllRequests: (state) => {
      state.requests = {};
    },
    resetRequest: resetRequestReducer,
    setGlobalLoading: (
      state, action: PayloadAction<boolean>
    ) => { state.globalLoading = action.payload; },
    setGlobalError: (
      state,
      action: PayloadAction<string | null>
    ) => { state.globalError = action.payload; },
    setRefetchInterval:
      setRefetchIntervalReducer,
  },
  extraReducers: (builder) => {
    buildFetchReducers(builder);
    buildMutateReducers(builder);
    buildRefetchReducers(builder);
    buildCleanupReducers(builder);
  },
});

export const {
  setRequestLoading, setRequestError,
  setRequestData, clearRequest, clearAllRequests,
  resetRequest, setGlobalLoading, setGlobalError,
  setRefetchInterval,
} = asyncDataSlice.actions;

export {
  selectAsyncRequest, selectAsyncData,
  selectAsyncError, selectAsyncLoading,
  selectAsyncRefetching, selectAllAsyncRequests,
  selectGlobalLoading, selectGlobalError,
} from './asyncDataSelectors';

export default asyncDataSlice.reducer;
