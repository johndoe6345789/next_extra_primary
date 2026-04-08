/**
 * Redux Slice for Authentication State
 */

import { createSlice, PayloadAction } from
  '@reduxjs/toolkit';
import { authInitialState } from './authTypes';
import type { User } from './authTypes';

export type { User, AuthState } from './authTypes';

export const authSlice = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    setLoading: (
      state, action: PayloadAction<boolean>
    ) => { state.isLoading = action.payload; },
    setError: (
      state,
      action: PayloadAction<string | null>
    ) => { state.error = action.payload; },
    setAuthenticated: (
      state,
      action: PayloadAction<{
        user: User; token: string;
      }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      state.isLoading = false;
    },
    setUser: (
      state, action: PayloadAction<User>
    ) => { state.user = action.payload; },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    },
    clearError: (state) => { state.error = null; },
    restoreFromStorage: (
      state,
      action: PayloadAction<{
        user: User | null;
        token: string | null;
      }>
    ) => {
      if (
        action.payload.token &&
        action.payload.user
      ) {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      } else {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      }
    },
  },
});

export const {
  setLoading, setError, setAuthenticated,
  setUser, logout, clearError,
  restoreFromStorage,
} = authSlice.actions;

export {
  selectIsAuthenticated, selectUser,
  selectToken, selectIsLoading, selectError,
} from './authSelectors';

export default authSlice.reducer;
