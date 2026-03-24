/**
 * Client-side validation helpers.
 * Each returns {valid, message?}.
 * @module lib/validators
 */

/** Validation result shape. */
export interface ValidationResult {
  valid: boolean;
  message?: string;
}

/**
 * Check whether a string is a valid email address.
 * @param email - value to validate
 */
export function isValidEmail(email: string): ValidationResult {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email) {
    return { valid: false, message: 'Email is required.' };
  }
  if (!re.test(email)) {
    return {
      valid: false,
      message: 'Invalid email format.',
    };
  }
  return { valid: true };
}

/**
 * Check whether a username meets requirements.
 * 3-30 chars, alphanumeric + underscores.
 * @param username - value to validate
 */
export function isValidUsername(username: string): ValidationResult {
  if (!username) {
    return {
      valid: false,
      message: 'Username is required.',
    };
  }
  if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
    return {
      valid: false,
      message:
        'Username must be 3-30 alphanumeric ' + 'characters or underscores.',
    };
  }
  return { valid: true };
}

/**
 * Check whether a password meets strength rules.
 * Min 8 chars, 1 upper, 1 lower, 1 digit.
 * @param password - value to validate
 */
export function isValidPassword(password: string): ValidationResult {
  if (!password) {
    return {
      valid: false,
      message: 'Password is required.',
    };
  }
  if (password.length < 8) {
    return {
      valid: false,
      message: 'Must be at least 8 characters.',
    };
  }
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: 'Must contain an uppercase letter.',
    };
  }
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      message: 'Must contain a lowercase letter.',
    };
  }
  if (!/\d/.test(password)) {
    return {
      valid: false,
      message: 'Must contain a digit.',
    };
  }
  return { valid: true };
}

/**
 * Check that a value is not empty.
 * @param value - value to validate
 * @param fieldName - label for the error message
 */
export function isRequired(
  value: string,
  fieldName = 'This field',
): ValidationResult {
  if (!value || !value.trim()) {
    return {
      valid: false,
      message: `${fieldName} is required.`,
    };
  }
  return { valid: true };
}
