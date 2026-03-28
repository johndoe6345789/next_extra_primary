/**
 * Auth slice — manages user session state.
 * @module store/slices/authSlice
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, LoginResponse, User } from '../../types/auth';

/** Match RTK Query action by endpoint name + lifecycle. */
type AnyAction = { type: string; meta?: {
  arg?: { endpointName?: string };
}; };
const matchEp = (name: string, suffix: string) =>
  (a: AnyAction): boolean =>
    a.type.endsWith(`/${suffix}`)
    && a.meta?.arg?.endpointName === name;

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
  extraReducers: (builder) => {
    builder
      .addMatcher(matchEp('login', 'pending'), (state) => {
        state.isLoading = true;
      })
      .addMatcher(
        matchEp('login', 'fulfilled'),
        (state, action) => {
          const p =
            (action as { payload: LoginResponse }).payload;
          state.user = p.user;
          state.accessToken = p.tokens.accessToken;
          state.refreshToken = p.tokens.refreshToken;
          state.isAuthenticated = true;
          state.isLoading = false;
        },
      )
      .addMatcher(matchEp('login', 'rejected'), (state) => {
        state.isLoading = false;
      })
      .addMatcher(
        matchEp('logout', 'fulfilled'),
        (state) => {
          state.user = null;
          state.accessToken = null;
          state.refreshToken = null;
          state.isAuthenticated = false;
        },
      );
  },
});

export const {
  setCredentials, clearCredentials, setUser,
} = authSlice.actions;

export default authSlice.reducer;
