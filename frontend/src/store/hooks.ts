/**
 * Typed Redux hooks for use throughout the app.
 * @module store/hooks
 */
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * Typed `useDispatch` hook.
 * Use instead of plain `useDispatch` to get
 * correct thunk/async dispatch types.
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

/**
 * Typed `useSelector` hook.
 * Use instead of plain `useSelector` so the
 * state parameter is already typed as RootState.
 */
export const useAppSelector = useSelector.withTypes<RootState>();
