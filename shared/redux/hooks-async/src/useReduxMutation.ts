/**
 * Redux-backed mutation hook
 */

import {
  useCallback, useRef, useEffect,
} from 'react';
import { useDispatch, useSelector } from
  'react-redux';
import {
  mutateAsyncData, selectAsyncRequest,
  type RootState,
} from '@shared/redux-slices';
import type {
  UseMutationOptions, UseMutationResult,
} from './mutationTypes';

type Status =
  'idle' | 'pending' | 'succeeded' | 'failed';

/** Execute mutations with Redux backing */
export function useReduxMutation<
  TData = unknown, TResponse = unknown
>(
  mutateFn: (
    payload: TData
  ) => Promise<TResponse>,
  options?: UseMutationOptions<TData, TResponse>
): UseMutationResult<TData, TResponse> {
  const dispatch = useDispatch();
  const idRef = useRef('');
  if (!idRef.current) {
    const rand = Math.random()
      .toString(36).slice(2);
    idRef.current =
      `mutation-${Date.now()}-${rand}`;
  }
  const mid = idRef.current;
  const as = useSelector((s: RootState) =>
    selectAsyncRequest(s, mid));
  const status = (as?.status ?? 'idle') as Status;
  const error = as?.error ?? null;
  const isLoading = status === 'pending';

  useEffect(() => {
    if (status === 'succeeded' && as?.data &&
      options?.onSuccess)
      options.onSuccess(as.data as TResponse);
  }, [status, as?.data, options]);

  useEffect(() => {
    if (status === 'failed' && error &&
      options?.onError) options.onError(error);
  }, [status, error, options]);

  useEffect(() => {
    options?.onStatusChange?.(status);
  }, [status, options]);

  const mutate = useCallback(async (
    payload: TData
  ): Promise<TResponse> => {
    const result = await (dispatch as never)(
      mutateAsyncData({
        id: mid,
        mutateFn: () => mutateFn(payload),
        payload,
      }));
    if (result.payload)
      return result.payload.data as TResponse;
    throw new Error(
      result.payload?.error ?? 'Mutation failed'
    );
  }, [mid, mutateFn, dispatch]);

  const reset = useCallback(() => {}, []);

  return {
    mutate, isLoading, error, reset, status,
  };
}
