/**
 * Type definitions for useLoginLogic
 */

/** Login credentials */
export interface LoginData {
  email: string
  password: string
}

/** Return type of useLoginLogic */
export interface UseLoginLogicReturn {
  handleLogin: (
    data: LoginData
  ) => Promise<void>
}

/**
 * Validate login form data
 * @returns Error message or null
 */
export const validateLogin = (
  data: LoginData
): string | null => {
  if (!data.email.trim()) {
    return 'Email is required'
  }
  if (!data.password) {
    return 'Password is required'
  }
  return null
}
