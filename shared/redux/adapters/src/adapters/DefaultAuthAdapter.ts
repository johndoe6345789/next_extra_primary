/**
 * DefaultAuthServiceAdapter
 * HTTP-based authentication with localStorage.
 */

import type { IAuthServiceAdapter, AuthResponse, User } from '../types'
import { persistAuth, clearAuth, getCurrentUser, isAuthenticated, getToken, getUser } from './DefaultAuthState'

const JSON_HEADERS = { 'Content-Type': 'application/json' }

/** @brief HTTP adapter for auth operations */
export class DefaultAuthServiceAdapter implements IAuthServiceAdapter {
  private token: string | null = null
  private user: User | null = null

  constructor(private apiBaseUrl: string = '/api') {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
      const userStr = localStorage.getItem('auth_user')
      if (userStr) { try { this.user = JSON.parse(userStr) } catch { /* invalid */ } }
    }
  }

  /** @brief Login with email/password */
  async login(email: string, password: string): Promise<AuthResponse> {
    const r = await fetch(`${this.apiBaseUrl}/auth/login`, {
      method: 'POST', headers: JSON_HEADERS, body: JSON.stringify({ email, password }),
    })
    if (!r.ok) throw new Error('Login failed')
    const data: AuthResponse = await r.json()
    persistAuth.call(this as any, data)
    return data
  }

  /** @brief Register new user */
  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const r = await fetch(`${this.apiBaseUrl}/auth/register`, {
      method: 'POST', headers: JSON_HEADERS, body: JSON.stringify({ email, password, name }),
    })
    if (!r.ok) throw new Error('Registration failed')
    const data: AuthResponse = await r.json()
    persistAuth.call(this as any, data)
    return data
  }

  /** @brief Logout current user */
  async logout(): Promise<void> {
    const r = await fetch(`${this.apiBaseUrl}/auth/logout`, {
      method: 'POST', headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
    })
    if (!r.ok) throw new Error('Logout failed')
    clearAuth.call(this as any)
  }

  getCurrentUser = getCurrentUser
  isAuthenticated = isAuthenticated
  getToken = getToken
  getUser = getUser
}
