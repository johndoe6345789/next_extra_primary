/**
 * Authentication-related type definitions.
 * @module types/auth
 */

/** Represents an authenticated user. */
export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  role: 'guest' | 'user' | 'moderator' | 'admin';
  createdAt: string;
  updatedAt: string;
}

/** Payload for login requests. */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Response from a successful login. */
export interface LoginResponse {
  user: User;
  tokens: TokenPair;
}

/**
 * Partial login response when backend requires
 * a TOTP second factor to complete authentication.
 */
export interface TotpChallengeResponse {
  require_totp: true;
  totp_session_token: string;
}

/** Payload for registration requests. */
export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  displayName?: string;
}

/** Access and refresh token pair. */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/** Redux auth slice state shape. */
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** True until the SSO-cookie bootstrap fetch
   *  (useInitAuth) has completed.  AuthGate must
   *  not redirect while this is true. */
  isInitializing: boolean;
  /** True when backend login requires TOTP step. */
  requireTotp: boolean;
  /** Short-lived token for the TOTP verify-login. */
  totpSessionToken: string | null;
}
