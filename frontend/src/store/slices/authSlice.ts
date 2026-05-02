/**
 * Auth slice — manages user session state.
 * @module store/slices/authSlice
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  AuthState,
  User,
  TotpChallengeResponse,
} from '../../types/auth';
import { addAuthMatchers } from './authMatchers';
import { buildInitialAuthState } from './authInitialState';

const initialState: AuthState = buildInitialAuthState();

/** Payload accepted by setCredentials. */
interface CredentialsPayload {
  user: User;
  accessToken: string;
  /** Optional — absent when session is bootstrapped
   *  from HttpOnly SSO cookie via /api/auth/sso-session. */
  refreshToken?: string;
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
      state.refreshToken = refreshToken ?? null;
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
    /** Called when useInitAuth bootstrap completes. */
    initComplete(state) {
      state.isInitializing = false;
    },
    /** Set when login returns require_totp: true. */
    setTotpChallenge(
      state,
      action: PayloadAction<TotpChallengeResponse>,
    ) {
      state.requireTotp = true;
      state.totpSessionToken =
        action.payload.totp_session_token;
    },
    /** Clear TOTP challenge after success or cancel. */
    clearTotpChallenge(state) {
      state.requireTotp = false;
      state.totpSessionToken = null;
    },
  },
  extraReducers: (builder) => {
    addAuthMatchers(builder);
  },
});

export const {
  setCredentials,
  clearCredentials,
  setUser,
  initComplete,
  setTotpChallenge,
  clearTotpChallenge,
} = authSlice.actions;

export default authSlice.reducer;
