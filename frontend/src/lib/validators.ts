/**
 * Client-side validation helpers.
 * Each returns {valid, message?}.
 * @module lib/validators
 */

import validationConfig from
  '@/constants/validation.json';
import type { ValidationResult } from
  './validatorTypes';

export type { ValidationResult } from
  './validatorTypes';
export {
  isValidPassword, isRequired,
} from './passwordValidator';

const vc = validationConfig;

/**
 * Check whether a string is a valid email address.
 * @param email - value to validate
 */
export function isValidEmail(
  email: string,
): ValidationResult {
  const re = new RegExp(vc.email.pattern);
  if (!email) {
    return {
      valid: false,
      message: vc.email.messages.required,
    };
  }
  if (!re.test(email)) {
    return {
      valid: false,
      message: vc.email.messages.invalid,
    };
  }
  return { valid: true };
}

/**
 * Check whether a username meets requirements.
 * @param username - value to validate
 */
export function isValidUsername(
  username: string,
): ValidationResult {
  const {
    minLength, maxLength, pattern, messages,
  } = vc.username;
  if (!username) {
    return {
      valid: false, message: messages.required,
    };
  }
  if (username.length < minLength) {
    return {
      valid: false, message: messages.tooShort,
    };
  }
  if (username.length > maxLength) {
    return {
      valid: false, message: messages.tooLong,
    };
  }
  if (!new RegExp(pattern).test(username)) {
    return {
      valid: false, message: messages.invalid,
    };
  }
  return { valid: true };
}
