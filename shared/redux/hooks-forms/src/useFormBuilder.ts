/**
 * useFormBuilder Hook
 * Form state management with validation
 * and field array support.
 */

import { useCallback, useState, useRef } from 'react'
import type { UseFormBuilderOptions, UseFormBuilderReturn } from './formBuilderTypes'
import { buildFieldArray } from './formFieldArray'
import { useFormValidation, computeDirtyState } from './formValidation'
import { useFormSubmit } from './formSubmit'

export type {
  ValidationErrors, FormFieldArray,
  UseFormBuilderOptions, UseFormBuilderReturn,
} from './formBuilderTypes'

/** @brief Form state hook with validation */
export function useFormBuilder<T extends Record<string, any>>(
  options: UseFormBuilderOptions<T>
): UseFormBuilderReturn<T> {
  const {
    initialValues, validation, onSubmit,
    validateOnBlur = true, validateOnChange = false,
  } = options

  const [values, setValues] = useState<T>(initialValues)
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const initialRef = useRef(initialValues)

  const { errors, setErrors, isValidating, validate, isValid } =
    useFormValidation(validation, values)

  const { handleSubmit, isSubmitting, submitError, setSubmitError } =
    useFormSubmit(values, validate, setErrors, setTouched, onSubmit)

  const setFieldValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    if (validateOnChange) setErrors(validate({ ...values, [field]: value }))
  }, [validateOnChange, validate, values, setErrors])

  const handleSetValues = useCallback((v: Partial<T>) => {
    setValues((prev) => ({ ...prev, ...v }))
  }, [])

  const setFieldTouched = useCallback(<K extends keyof T>(f: K, t = true) => {
    setTouched((prev) => ({ ...prev, [f]: t }))
    if (validateOnBlur && t) setErrors(validate())
  }, [validateOnBlur, validate, setErrors])

  const handleSetTouched = useCallback((t: Partial<Record<keyof T, boolean>>) => {
    setTouched((prev) => ({ ...prev, ...t }))
  }, [])

  const resetField = useCallback(<K extends keyof T>(f: K) => {
    setValues((prev) => ({ ...prev, [f]: initialRef.current[f] }))
    setTouched((prev) => ({ ...prev, [f]: false }))
  }, [])

  const reset = useCallback(() => {
    setValues(initialRef.current); setErrors({}); setTouched({}); setSubmitError(null)
  }, [setErrors, setSubmitError])

  const getFieldArray = useCallback(<K extends keyof T>(f: K) =>
    buildFieldArray(values[f], setFieldValue, f)
  , [values, setFieldValue])

  const { isDirty, dirty } = computeDirtyState(values, initialRef.current)

  return {
    values, setFieldValue, setValues: handleSetValues,
    errors, getFieldError: (f) => errors[f], hasError: (f) => Boolean(errors[f]),
    touched, setFieldTouched, setTouched: handleSetTouched,
    isDirty, dirty, resetField,
    submit: handleSubmit, isSubmitting, submitError,
    reset, isValid, isValidating, getFieldArray,
  }
}
