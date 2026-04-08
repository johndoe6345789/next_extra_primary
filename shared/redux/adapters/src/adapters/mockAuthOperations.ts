/**
 * Mock Auth Operations
 *
 * Login and register logic for the
 * MockAuthServiceAdapter.
 */

import type { AuthResponse, User } from '../types'

/**
 * @brief Attempt mock login
 * @param users - In-memory user store
 * @param email - Login email
 * @param password - Login password
 * @returns Auth response with user and token
 */
export function mockLogin(
  users: Map<
    string,
    { user: User; password: string }
  >,
  email: string,
  password: string
): AuthResponse {
  const entry = users.get(email)
  if (!entry || entry.password !== password) {
    throw new Error(
      'Invalid email or password'
    )
  }
  const token = `token-${Date.now()}`
  return {
    success: true,
    user: { ...entry.user },
    token,
  }
}

/**
 * @brief Register a new mock user
 * @param users - In-memory user store
 * @param email - Registration email
 * @param password - Registration password
 * @param name - User display name
 * @returns Auth response with new user
 */
export function mockRegister(
  users: Map<
    string,
    { user: User; password: string }
  >,
  email: string,
  password: string,
  name: string
): AuthResponse {
  if (users.has(email)) {
    throw new Error('User already exists')
  }
  const id = `user-${Date.now()}`
  const user: User = { id, email, name }
  users.set(email, { user, password })
  const token = `token-${Date.now()}`
  return {
    success: true,
    user: { ...user },
    token,
  }
}
