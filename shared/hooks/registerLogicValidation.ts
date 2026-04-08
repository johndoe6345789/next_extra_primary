/**
 * Registration validation logic
 */

export interface RegistrationData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface UseRegisterLogicReturn {
  handleRegister: (
    data: RegistrationData
  ) => Promise<void>
}

/**
 * Validate registration form data
 * @returns Error message or null if valid
 */
export const validateRegistration = (
  data: RegistrationData
): string | null => {
  const { name, email, password, confirmPassword } = data

  if (!name.trim()) return 'Name is required'
  if (name.length < 2) {
    return 'Name must be at least 2 characters'
  }
  if (!email.trim()) return 'Email is required'
  if (!password) return 'Password is required'
  if (password.length < 8) {
    return 'Password must be at least 8 characters'
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain lowercase letters'
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain uppercase letters'
  }
  if (!/\d/.test(password)) {
    return 'Password must contain numbers'
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match'
  }

  return null
}
