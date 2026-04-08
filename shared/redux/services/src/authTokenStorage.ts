/**
 * Auth token and user storage helpers
 */

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'current_user';

/** Auth user type */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  created_at?: string;
}

/** Auth response from login/register */
export interface AuthResponse {
  success: boolean;
  user: AuthUser;
  token: string;
}

/** Get stored token */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/** Set token in storage */
export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

/** Clear token from storage */
export function clearToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

/** Get stored user */
export function getUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const u = localStorage.getItem(USER_KEY);
  return u ? JSON.parse(u) : null;
}

/** Set user in storage */
export function setUser(user: AuthUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(
    USER_KEY, JSON.stringify(user)
  );
}

/** Clear user from storage */
export function clearUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_KEY);
}

/** Get auth headers for API requests */
export function getAuthHeaders(
): Record<string, string> {
  const token = getToken();
  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}

/** Check if user is authenticated */
export function isAuthenticated(): boolean {
  return !!getToken() && !!getUser();
}
