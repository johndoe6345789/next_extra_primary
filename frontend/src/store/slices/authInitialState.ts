/**
 * @file authInitialState.ts
 * @brief Initial state builder for the auth slice.
 *        Hydrates user + accessToken from the Keycloak
 *        nextra_sso cookie so RTK Query has the right
 *        auth state on first render.
 */
import type { AuthState } from '../../types/auth';
import { readKeycloakUser } from '@/hooks/keycloakUserMap';

/** Build the initial auth slice state. */
export function buildInitialAuthState(): AuthState {
  const base: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    isInitializing: true,
    requireTotp: false,
    totpSessionToken: null,
  };
  const kc = readKeycloakUser();
  if (!kc) return base;
  return {
    ...base,
    user: kc.user,
    accessToken: kc.accessToken,
    isAuthenticated: true,
  };
}
