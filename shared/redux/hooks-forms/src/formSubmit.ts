/**
 * Form Submit Handler
 * Handles form submission with validation
 */

import { useCallback, useState } from 'react'
import type { ValidationErrors } from './formBuilderTypes'

/**
 * Create submit handler for form builder
 * @param values - Current form values
 * @param validate - Validation function
 * @param setErrors - Errors setter
 * @param setTouched - Touched setter
 * @param onSubmit - Submit callback
 * @returns Submit handler and state
 */
export function useFormSubmit<
  T extends Record<string, any>
>(
  values: T,
  validate: (v: T) => ValidationErrors<T>,
  setErrors: (e: ValidationErrors<T>) => void,
  setTouched: (
    t: Partial<Record<keyof T, boolean>>
  ) => void,
  onSubmit: (v: T) => Promise<void> | void
) {
  const [isSubmitting, setIsSubmitting] =
    useState(false)
  const [submitError, setSubmitError] =
    useState<string | null>(null)

  /** @brief Handle form submission */
  const handleSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true)
      setSubmitError(null)
      const errs = validate(values)
      setErrors(errs)
      setTouched(
        Object.keys(values).reduce(
          (a, k) => ({ ...a, [k]: true }),
          {}
        )
      )
      if (Object.keys(errs).length > 0) {
        setIsSubmitting(false)
        return
      }
      await onSubmit(values)
    } catch (e) {
      setSubmitError(
        e instanceof Error
          ? e.message
          : 'Submission failed'
      )
    } finally {
      setIsSubmitting(false)
    }
  }, [
    values,
    validate,
    onSubmit,
    setErrors,
    setTouched,
  ])

  return {
    handleSubmit,
    isSubmitting,
    submitError,
    setSubmitError,
  }
}
