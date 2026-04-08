/**
 * Form submission hook
 */

import { useState, useCallback } from 'react'
import type {
  FormConfig,
  UseFormReturn,
} from './formFieldTypes'

/**
 * Hook for form submission state
 * @param config - Form configuration
 */
export function useForm(
  config: FormConfig
): UseFormReturn {
  const [isSubmitting, setIsSubmitting] =
    useState(false)

  const submit = useCallback(
    async (
      values: Record<string, unknown>
    ) => {
      setIsSubmitting(true)
      try {
        await config.onSubmit?.(values)
      } finally {
        setIsSubmitting(false)
      }
    },
    [config]
  )

  return { submit, isSubmitting }
}
