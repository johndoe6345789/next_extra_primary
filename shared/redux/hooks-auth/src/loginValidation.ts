/**
 * Login Validation Rules
 * Email and password validation
 */

/** @brief Login form data */
export interface LoginData {
  email: string
  password: string
}

/**
 * Validate login form data
 * @param data - Login form values
 * @returns Error message or null if valid
 */
export const validateLogin = (
  data: LoginData
): string | null => {
  const { email, password } = data

  if (!email.trim()) {
    return 'Email is required'
  }
  if (!password) {
    return 'Password is required'
  }

  return null
}
