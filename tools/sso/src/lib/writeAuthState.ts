/**
 * @file writeAuthState.ts
 * @brief Writes login tokens to the redux-persist
 * localStorage key so the main Next.js app is
 * already authenticated when it boots after SSO.
 *
 * The main app uses redux-persist with key
 * `nextra-root`, whitelisting the `auth` slice.
 */

/** Shape returned by /api/auth/login. */
export interface LoginPayload {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  user: {
    id: string;
    email: string;
    username: string;
    displayName: string;
    role: string;
  };
}

/**
 * Persist auth tokens to localStorage in the
 * format redux-persist expects, so the main app
 * rehydrates as authenticated on first load.
 *
 * @param data - Raw JSON from /api/auth/login.
 */
export function writeAuthState(
  data: LoginPayload,
): void {
  const authSlice = JSON.stringify({
    user: data.user,
    accessToken: data.tokens.accessToken,
    refreshToken: data.tokens.refreshToken,
    isAuthenticated: true,
    isLoading: false,
  });
  localStorage.setItem(
    'persist:nextra-root',
    JSON.stringify({
      auth: authSlice,
      _persist: JSON.stringify({
        version: -1,
        rehydrated: true,
      }),
    }),
  );
}
