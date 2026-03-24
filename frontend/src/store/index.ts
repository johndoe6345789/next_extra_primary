/**
 * Barrel export for the Redux store.
 * @module store
 */

export { makeStore } from './store';
export type { AppStore, RootState, AppDispatch } from './store';
export { useAppDispatch, useAppSelector } from './hooks';
export { persistConfig } from './persistConfig';
