/**
 * Barrel export for the Redux store.
 * @module store
 */

export { store } from './store';
export type { RootState, AppDispatch } from './store';
export { useAppDispatch, useAppSelector } from './hooks';
export { persistConfig } from './persistConfig';
