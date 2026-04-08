/**
 * Auth Service - barrel re-export
 */

export type {
  AuthUser as User, AuthResponse,
} from './authTokenStorage';

import {
  getToken, setToken, clearToken,
  getUser, setUser, clearUser,
  getAuthHeaders, isAuthenticated,
} from './authTokenStorage';
import {
  register, login, logout,
  getCurrentUser, changePassword,
} from './authRequests';

class AuthService {
  register = register;
  login = login;
  logout = logout;
  getCurrentUser = getCurrentUser;
  changePassword = changePassword;
  isAuthenticated = isAuthenticated;
  getToken = getToken;
  setToken = setToken;
  clearToken = clearToken;
  getUser = getUser;
  setUser = setUser;
  clearUser = clearUser;
  getAuthHeaders = getAuthHeaders;
}

export const authService = new AuthService();
export default authService;
