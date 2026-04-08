/**
 * Redux-backed async data hook
 */

import {
  useEffect, useRef, useCallback,
} from 'react';
import { useDispatch, useSelector } from
  'react-redux';
import {
  fetchAsyncData, refetchAsyncData,
  selectAsyncRequest,
  type RootState,
} from '@shared/redux-slices';
import type {
  UseAsyncDataOptions, UseAsyncDataResult,
} from './asyncDataTypes';
import {
  useSuccessEffect, useErrorEffect,
  useFocusRefetch,
} from './useAsyncDataEffects';

/** Fetch async data with Redux backing */
export function useReduxAsyncData<T = unknown>(
  fetchFn: () => Promise<T>,
  options?: UseAsyncDataOptions
): UseAsyncDataResult<T> {
  const dispatch = useDispatch();
  const idRef = useRef('');
  if (!idRef.current)
    idRef.current = `async-${Date.now()}-` +
      Math.random().toString(36).slice(2);
  const rid = idRef.current;
  const as = useSelector((s: RootState) =>
    selectAsyncRequest(s, rid));
  const status = as?.status ?? 'idle';
  const data = (as?.data ?? undefined) as
    T | undefined;
  const error = as?.error ?? null;
  const isRefetching = as?.isRefetching ?? false;
  const isLoading =
    status === 'pending' && !isRefetching;
  const retryCount = as?.retryCount ?? 0;
  const maxR = options?.maxRetries ?? 3;
  const shouldRetry =
    status === 'failed' && retryCount < maxR;

  useEffect(() => {
    if (status === 'idle' || shouldRetry) {
      void (dispatch as never)(fetchAsyncData({
        id: rid, fetchFn,
        maxRetries: options?.maxRetries,
        retryDelay: options?.retryDelay,
      }));
    }
  }, [
    rid, status, shouldRetry, fetchFn,
    dispatch, options?.maxRetries,
    options?.retryDelay,
    ...(options?.dependencies ?? []),
  ]);

  const refetch = useCallback(async () => {
    return (dispatch as never)(refetchAsyncData({
      id: rid, fetchFn }));
  }, [rid, fetchFn, dispatch]);

  const retry = useCallback(() =>
    refetch(), [refetch]);

  useSuccessEffect(status, data, options);
  useErrorEffect(status, error, options);
  useFocusRefetch(
    refetch, options?.refetchOnFocus
  );

  return {
    data, isLoading, error,
    isRefetching, retry, refetch,
  };
}
