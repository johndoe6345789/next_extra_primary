/**
 * Password validation logic.
 * @module lib/passwordValidator
 */

import validationConfig from
  '@/constants/validation.json';
import type { ValidationResult } from
  './validatorTypes';

const vc = validationConfig;

/**
 * Check whether a password meets strength rules.
 * @param password - value to validate
 */
export function isValidPassword(
  password: string,
): ValidationResult {
  const { minLength, messages } = vc.password;
  if (!password) {
    return {
      valid: false,
      message: messages.required,
    };
  }
  if (password.length < minLength) {
    return {
      valid: false,
      message: messages.tooShort,
    };
  }
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: messages.missingUppercase,
    };
  }
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      message: messages.missingLowercase,
    };
  }
  if (!/\d/.test(password)) {
    return {
      valid: false,
      message: messages.missingDigit,
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
