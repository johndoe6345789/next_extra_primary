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
  role: 'user' | 'admin' | 'moderator';
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
}
