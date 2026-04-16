/**
 * RTK Query lifecycle matchers for the auth slice.
 * @module store/slices/authMatchers
 */
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import type {
  AuthState,
  LoginResponse,
  TotpChallengeResponse,
} from '../../types/auth';

/** Loosely-typed action for endpoint matching. */
type AnyAction = { type: string; meta?: {
  arg?: { endpointName?: string };
}; };

/** Match RTK Query action by endpoint + lifecycle. */
const matchEp = (name: string, suffix: string) =>
  (a: AnyAction): boolean =>
    a.type.endsWith(`/${suffix}`)
    && a.meta?.arg?.endpointName === name;

/** Check if response is a TOTP challenge. */
const isTotpChallenge = (
  p: unknown,
): p is TotpChallengeResponse =>
  typeof p === 'object'
  && p !== null
  && (p as Record<string, unknown>)
    .require_totp === true;

/** Store credentials from a fulfilled auth response. */
const storeCredentials = (
  state: AuthState, action: { payload: unknown },
) => {
  if (isTotpChallenge(action.payload)) {
    state.requireTotp = true;
    state.totpSessionToken =
      action.payload.totp_session_token;
    state.isLoading = false;
    return;
  }
  const p = action.payload as LoginResponse;
  state.user = p.user;
  state.accessToken = p.tokens.accessToken;
  state.refreshToken = p.tokens.refreshToken;
  state.isAuthenticated = true;
  state.isLoading = false;
  state.requireTotp = false;
  state.totpSessionToken = null;
};

/** Clear all credential fields. */
const clearAll = (state: AuthState) => {
  state.user = null;
  state.accessToken = null;
  state.refreshToken = null;
  state.isAuthenticated = false;
};

/**
 * Adds login, register, and logout matchers
 * to the auth slice builder.
 *
 * @param builder - The extraReducers builder.
 */
export function addAuthMatchers(
  builder: ActionReducerMapBuilder<AuthState>,
): void {
  builder
    .addMatcher(matchEp('login', 'pending'), (s) => {
      s.isLoading = true;
    })
    .addMatcher(
      matchEp('login', 'fulfilled'), storeCredentials,
    )
    .addMatcher(matchEp('login', 'rejected'), (s) => {
      s.isLoading = false;
    })
    .addMatcher(
      matchEp('register', 'pending'), (s) => {
        s.isLoading = true;
      },
    )
    .addMatcher(
      matchEp('register', 'fulfilled'),
      storeCredentials,
    )
    .addMatcher(
      matchEp('register', 'rejected'), (s) => {
        s.isLoading = false;
      },
    )
    .addMatcher(
      matchEp('logout', 'fulfilled'), clearAll,
    );
}
