/**
 * Auth API request functions
 */

import type { AuthResponse } from
  './authTokenStorage';
import {
  setToken, setUser, getToken,
  clearToken, clearUser,
} from './authTokenStorage';

export {
  getCurrentUser, changePassword,
} from './authAccount';

const API_BASE =
  process.env.REACT_APP_API_URL ||
  'http://localhost:5000';

/** Register new user */
export async function register(
  email: string,
  password: string,
  name: string
): Promise<AuthResponse> {
  const res = await fetch(
    `${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email, password, name,
      }),
    }
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      data.error || 'Registration failed'
    );
  }
  setToken(data.token);
  setUser(data.user);
  return data;
}

/** Login user */
export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(
    `${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    }
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      data.error || 'Login failed'
    );
  }
  setToken(data.token);
  setUser(data.user);
  return data;
}

/** Logout user */
export function logout(): void {
  const token = getToken();
  if (token) {
    fetch(`${API_BASE}/api/auth/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).catch(() => {});
  }
  clearToken();
  clearUser();
}
