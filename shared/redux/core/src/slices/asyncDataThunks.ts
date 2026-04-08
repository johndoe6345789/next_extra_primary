/**
 * Async data thunks for fetch, mutate, refetch
 */

import { createAsyncThunk } from '@reduxjs/toolkit';

/** Extract error message from caught error */
const getErrMsg = (err: unknown) =>
  err instanceof Error ? err.message : String(err);

/** Generic fetch thunk */
export const fetchAsyncData = createAsyncThunk(
  'asyncData/fetch',
  async (params: {
    id: string;
    fetchFn: () => Promise<unknown>;
    maxRetries?: number;
    retryDelay?: number;
  }, { rejectWithValue }) => {
    try {
      const data = await params.fetchFn();
      return { id: params.id, data };
    } catch (e) {
      return rejectWithValue({
        id: params.id, error: getErrMsg(e),
      });
    }
  }
);

/** Mutation thunk - POST, PUT, DELETE */
export const mutateAsyncData = createAsyncThunk(
  'asyncData/mutate',
  async (params: {
    id: string;
    mutateFn: (p: unknown) => Promise<unknown>;
    payload: unknown;
  }, { rejectWithValue }) => {
    try {
      const data = await params.mutateFn(
        params.payload
      );
      return { id: params.id, data };
    } catch (e) {
      return rejectWithValue({
        id: params.id, error: getErrMsg(e),
      });
    }
  }
);

/** Refetch thunk - preserves stale data on error */
export const refetchAsyncData = createAsyncThunk(
  'asyncData/refetch',
  async (params: {
    id: string;
    fetchFn: () => Promise<unknown>;
  }, { rejectWithValue }) => {
    try {
      const data = await params.fetchFn();
      return { id: params.id, data };
    } catch (e) {
      return rejectWithValue({
        id: params.id, error: getErrMsg(e),
      });
    }
  }
);

/** Cleanup thunk - removes stale requests */
export const cleanupAsyncRequests =
  createAsyncThunk(
    'asyncData/cleanup',
    async (params: { maxAge: number }) => params
  );
