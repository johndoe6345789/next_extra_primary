/**
 * Mutation and refetch async thunks
 */

import { createAsyncThunk } from '@reduxjs/toolkit';

/**
 * Mutation thunk for POST, PUT, DELETE
 */
export const mutateAsyncData = createAsyncThunk(
  'asyncData/mutate',
  async (
    params: {
      id: string;
      mutateFn: (
        payload: unknown
      ) => Promise<unknown>;
      payload: unknown;
    },
    { rejectWithValue }
  ) => {
    try {
      const result = await params.mutateFn(
        params.payload
      );
      return { id: params.id, data: result };
    } catch (error) {
      return rejectWithValue({
        id: params.id,
        error: error instanceof Error
          ? error.message
          : String(error),
      });
    }
  }
);

/**
 * Refetch without clearing data on error
 */
export const refetchAsyncData = createAsyncThunk(
  'asyncData/refetch',
  async (
    params: {
      id: string;
      fetchFn: () => Promise<unknown>;
    },
    { rejectWithValue }
  ) => {
    try {
      const result = await params.fetchFn();
      return { id: params.id, data: result };
    } catch (error) {
      return rejectWithValue({
        id: params.id,
        error: error instanceof Error
          ? error.message
          : String(error),
      });
    }
  }
);

/** Cleanup thunk - removes stale requests */
export const cleanupAsyncRequests = createAsyncThunk(
  'asyncData/cleanup',
  async (params: { maxAge: number }) => {
    return params;
  }
);
