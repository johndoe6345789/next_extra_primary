/**
 * Selectors for the auth slice
 */

import type { AuthState } from './authSlice';

/** Select authentication status */
export const selectIsAuthenticated = (
  state: { auth: AuthState }
) => state.auth.isAuthenticated;

/** Select current user */
export const selectUser = (
  state: { auth: AuthState }
) => state.auth.user;

/** Select auth token */
export const selectToken = (
  state: { auth: AuthState }
) => state.auth.token;

/** Select loading state */
export const selectIsLoading = (
  state: { auth: AuthState }
) => state.auth.isLoading;

/** Select error state */
export const selectError = (
  state: { auth: AuthState }
) => state.auth.error;
