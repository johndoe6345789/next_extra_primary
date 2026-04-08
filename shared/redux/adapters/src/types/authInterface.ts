/**
 * Auth Service Adapter Interface
 * Contract for authentication implementations
 */

import type {
  AuthResponse,
  User,
} from './adapterTypes'

/** @brief Authentication service contract */
export interface IAuthServiceAdapter {
  login(
    email: string,
    password: string
  ): Promise<AuthResponse>;
  register(
    email: string,
    password: string,
    name: string
  ): Promise<AuthResponse>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User>;
  isAuthenticated(): boolean;
  getToken(): string | null;
  getUser(): User | null;
}
