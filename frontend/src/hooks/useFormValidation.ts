'use client';

import { useState, useCallback } from 'react';

/** A single validation rule for a field. */
export interface ValidationRule {
  /** Regex pattern string to test against. */
  pattern?: string;
  /** Minimum length constraint. */
  minLength?: number;
  /** Maximum length constraint. */
  maxLength?: number;
  /** Whether the field is required. */
  required?: boolean;
  /** Error message when validation fails. */
  message: string;
}

/** Map of field names to their validation rules. */
export type ValidationRules = Record<
  string, ValidationRule[]
>;

/** Map of field names to error messages. */
type ErrorMap = Record<string, string | undefined>;

/** Return type for the useFormValidation hook. */
interface UseFormValidationReturn {
  /** Validate a single field value. */
  validate: (name: string, val: string) => boolean;
  /** Current errors keyed by field name. */
  errors: ErrorMap;
  /** Whether all validated fields passed. */
  isValid: boolean;
  /** Clear all current errors. */
  clearErrors: () => void;
}

/** Check one rule against a value. */
function fails(rule: ValidationRule, v: string) {
  if (rule.required && !v.trim()) return true;
  if (rule.minLength != null
    && v.length < rule.minLength) return true;
  if (rule.maxLength != null
    && v.length > rule.maxLength) return true;
  if (rule.pattern
    && !new RegExp(rule.pattern).test(v)) return true;
  return false;
}

/**
 * Provides field-level validation against a set of
 * declarative rules. Each call to validate checks
 * a single field and updates the errors map.
 *
 * @param rules - Validation rules keyed by field.
 * @returns Validation state and helpers.
 */
export function useFormValidation(
  rules: ValidationRules,
): UseFormValidationReturn {
  const [errors, setErrors] = useState<ErrorMap>({});

  const validate = useCallback(
    (name: string, value: string): boolean => {
      const list = rules[name] ?? [];
      for (const rule of list) {
        if (fails(rule, value)) {
          setErrors((p) => ({
            ...p, [name]: rule.message,
          }));
          return false;
        }
      }
      setErrors((p) => ({
        ...p, [name]: undefined,
      }));
      return true;
    },
    [rules],
  );

  const isValid = Object.values(errors).every(
    (e) => e === undefined,
  );
  const clearErrors = useCallback(
    () => setErrors({}), [],
  );

  return { validate, errors, isValid, clearErrors };
}

export default useFormValidation;
