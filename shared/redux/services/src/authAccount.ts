/**
 * Auth account management requests
 */

import type { AuthUser } from
  './authTokenStorage';
import {
  getToken, setUser, clearToken, clearUser,
} from './authTokenStorage';

const API_BASE =
  process.env.REACT_APP_API_URL ||
  'http://localhost:5000';

/** Get current user from backend */
export async function getCurrentUser(
): Promise<AuthUser> {
  const token = getToken();
  if (!token) throw new Error('No token found');
  const res = await fetch(
    `${API_BASE}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await res.json();
  if (!res.ok) {
    clearToken();
    clearUser();
    throw new Error(
      data.error || 'Failed to get user'
    );
  }
  setUser(data);
  return data;
}

/** Change password */
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const token = getToken();
  if (!token) {
    throw new Error('Not authenticated');
  }
  const res = await fetch(
    `${API_BASE}/api/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    }
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      data.error || 'Failed to change password'
    );
  }
}
