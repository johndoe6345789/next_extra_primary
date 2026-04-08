/**
 * Authentication type definitions
 */

/** Authenticated user */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: string;
}

/** Auth slice state shape */
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

/** Initial auth state */
export const authInitialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,
  error: null,
};
