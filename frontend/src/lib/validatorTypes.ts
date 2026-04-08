/**
 * Shared types for validation utilities.
 * @module lib/validatorTypes
 */

/** Validation result shape. */
export interface ValidationResult {
  valid: boolean;
  message?: string;
}
