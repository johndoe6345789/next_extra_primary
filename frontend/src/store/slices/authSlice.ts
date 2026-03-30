/**
 * Auth slice — manages user session state.
 * @module store/slices/authSlice
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '../../types/auth';
import { addAuthMatchers } from './authMatchers';

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
};

/** Payload accepted by setCredentials. */
interface CredentialsPayload {
  user: User;
  accessToken: string;
  refreshToken: string;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Store user + tokens after login/refresh. */
    setCredentials(
      state, action: PayloadAction<CredentialsPayload>,
    ) {
      const { user, accessToken, refreshToken } =
        action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
    },
    /** Clear session on logout or token failure. */
    clearCredentials(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
    /** Patch the stored user object. */
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
  },
  extraReducers: addAuthMatchers,
});

export const {
  setCredentials, clearCredentials, setUser,
} = authSlice.actions;

export default authSlice.reducer;
