/**
 * useUILoading Hook
 * Manages loading state and messages
 */

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type {
  RootState,
  SetLoadingAction,
  SetLoadingMessageAction,
  UseUILoadingReturn,
} from './uiLoadingTypes';

export type {
  UseUILoadingReturn,
} from './uiLoadingTypes';

/** Factory for custom action creators */
export function createUseUILoading(
  setLoadingAction: (
    p: boolean
  ) => SetLoadingAction,
  setLoadingMessageAction: (
    p: string | null
  ) => SetLoadingMessageAction
) {
  return function useUILoading(): UseUILoadingReturn {
    const dispatch = useDispatch();
    const loading = useSelector(
      (s: RootState) => s.ui.loading
    );
    const loadingMessage = useSelector(
      (s: RootState) => s.ui.loadingMessage
    );
    const setLoading = useCallback(
      (v: boolean) =>
        dispatch(setLoadingAction(v)),
      [dispatch]
    );
    const setLoadingMessage = useCallback(
      (m: string | null) =>
        dispatch(setLoadingMessageAction(m)),
      [dispatch]
    );
    return {
      loading,
      loadingMessage,
      setLoading,
      setLoadingMessage,
    };
  };
}

/** Default hook using action type strings */
export function useUILoading(): UseUILoadingReturn {
  const dispatch = useDispatch();
  const loading = useSelector(
    (s: RootState) => s.ui.loading
  );
  const loadingMessage = useSelector(
    (s: RootState) => s.ui.loadingMessage
  );
  const setLoading = useCallback(
    (v: boolean) =>
      dispatch({
        type: 'ui/setLoading',
        payload: v,
      }),
    [dispatch]
  );
  const setLoadingMessage = useCallback(
    (m: string | null) =>
      dispatch({
        type: 'ui/setLoadingMessage',
        payload: m,
      }),
    [dispatch]
  );
  return {
    loading,
    loadingMessage,
    setLoading,
    setLoadingMessage,
  };
}

export default useUILoading;
