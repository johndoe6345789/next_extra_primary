/**
 * Types for useUILoading hook
 */

import type { UnknownAction } from 'redux';

/** UI state with loading */
export interface UIState {
  loading: boolean;
  loadingMessage: string | null;
}

/** Root state shape */
export interface RootState {
  ui: UIState;
}

/** Redux action types */
export type SetLoadingAction =
  UnknownAction & { payload: boolean };
export type SetLoadingMessageAction =
  UnknownAction & { payload: string | null };

/** Return type of useUILoading */
export interface UseUILoadingReturn {
  loading: boolean;
  loadingMessage: string | null;
  setLoading: (isLoading: boolean) => void;
  setLoadingMessage: (
    message: string | null
  ) => void;
}
