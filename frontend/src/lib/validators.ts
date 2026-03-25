/**
 * Client-side validation helpers.
 * Each returns {valid, message?}.
 * @module lib/validators
 */

import validationConfig from '@/constants/validation.json';

const vc = validationConfig;

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
  const re = new RegExp(vc.email.pattern);
  if (!email) {
    return { valid: false, message: vc.email.messages.required };
  }
  if (!re.test(email)) {
    return { valid: false, message: vc.email.messages.invalid };
  }
  return { valid: true };
}

/**
 * Check whether a username meets requirements.
 * @param username - value to validate
 */
export function isValidUsername(username: string): ValidationResult {
  const { minLength, maxLength, pattern, messages } = vc.username;
  if (!username) {
    return { valid: false, message: messages.required };
  }
  if (username.length < minLength) {
    return { valid: false, message: messages.tooShort };
  }
  if (username.length > maxLength) {
    return { valid: false, message: messages.tooLong };
  }
  if (!new RegExp(pattern).test(username)) {
    return { valid: false, message: messages.invalid };
  }
  return { valid: true };
}

/**
 * Check whether a password meets strength rules.
 * @param password - value to validate
 */
export function isValidPassword(password: string): ValidationResult {
  const { minLength, messages } = vc.password;
  if (!password) {
    return { valid: false, message: messages.required };
  }
  if (password.length < minLength) {
    return { valid: false, message: messages.tooShort };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: messages.missingUppercase };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: messages.missingLowercase };
  }
  if (!/\d/.test(password)) {
    return { valid: false, message: messages.missingDigit };
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
