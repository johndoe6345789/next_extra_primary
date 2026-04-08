'use client'

import React from 'react'
import styles from '../../../scss/atoms/mat-select.module.scss'
import { SelectProps, SelectChangeEvent } from './SelectTypes'

/**
 * Props for the NativeSelectInner component
 */
interface NativeSelectInnerProps {
  /** Forward ref to the select element */
  selectRef: React.Ref<HTMLDivElement>
  /** Select component props */
  props: SelectProps
  /** Internal value setter */
  setInternalValue: (v: unknown) => void
}

/**
 * Native HTML select renderer for Select component
 */
export function NativeSelectInner({
  selectRef,
  props,
  setInternalValue,
}: NativeSelectInnerProps) {
  const {
    name,
    value,
    multiple = false,
    disabled = false,
    required = false,
    fullWidth = false,
    error = false,
    size = 'medium',
    children,
    className = '',
    onChange,
    inputProps,
  } = props

  return (
    <select
      ref={
        selectRef as unknown as React.Ref<
          HTMLSelectElement
        >
      }
      name={name}
      value={value as string}
      onChange={(e) => {
        const newValue = multiple
          ? Array.from(
              e.target.selectedOptions,
              (opt) => opt.value
            )
          : e.target.value
        setInternalValue(newValue)
        onChange?.({
          target: {
            value: newValue as string | string[],
            name,
          },
        })
      }}
      disabled={disabled}
      required={required}
      multiple={multiple}
      className={[
        styles.native,
        fullWidth ? styles.fullWidth : '',
        error ? styles.error : '',
        size === 'small' ? styles.small : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...inputProps}
    >
      {children}
    </select>
  )
}
