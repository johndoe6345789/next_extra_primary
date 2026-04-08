/**
 * MockAuthServiceAdapter
 *
 * In-memory authentication operations.
 */

import {
  IAuthServiceAdapter,
  AuthResponse,
  User,
} from '../types'
import {
  mockLogin,
  mockRegister,
} from './mockAuthOperations'

/** @brief In-memory auth operations */
export class MockAuthServiceAdapter
  implements IAuthServiceAdapter {
  private currentUser: User | null = null
  private currentToken: string | null = null
  private users: Map<
    string,
    { user: User; password: string }
  > = new Map()

  /** @brief Login with email/password */
  async login(
    email: string,
    password: string
  ): Promise<AuthResponse> {
    const res = mockLogin(
      this.users, email, password
    )
    this.currentUser = res.user
    this.currentToken = res.token
    return res
  }

  /** @brief Register a new user */
  async register(
    email: string,
    password: string,
    name: string
  ): Promise<AuthResponse> {
    const res = mockRegister(
      this.users, email, password, name
    )
    this.currentUser = res.user
    this.currentToken = res.token
    return res
  }

  /** @brief Logout */
  async logout(): Promise<void> {
    this.currentUser = null
    this.currentToken = null
  }

  /** @brief Get current user */
  async getCurrentUser(): Promise<User> {
    if (!this.currentUser) {
      throw new Error('Not authenticated')
    }
    return { ...this.currentUser }
  }

  /** @brief Check authentication status */
  isAuthenticated(): boolean {
    return (
      !!this.currentUser &&
      !!this.currentToken
    )
  }

  /** @brief Get auth token */
  getToken(): string | null {
    return this.currentToken
  }

  /** @brief Get user object */
  getUser(): User | null {
    return this.currentUser
      ? { ...this.currentUser }
      : null
  }
}
