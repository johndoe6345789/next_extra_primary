'use client'

import React, { forwardRef } from 'react'
import styles from '../../../scss/atoms/mat-select.module.scss'
import { SelectProps } from './SelectTypes'
import { NativeSelectInner } from './SelectNative'
import { SelectTrigger } from './SelectDropdown'
import { SelectMenu } from './SelectMenu'
import { useSelectLogic } from './useSelectLogic'
import { getDisplayValue, handleSelect, handleKeyDown } from './selectHelpers'

export type { SelectChangeEvent, SelectProps } from './SelectTypes'

/** Select - MUI-compatible select dropdown */
export const Select = forwardRef<HTMLDivElement, SelectProps>((props, ref) => {
  const {
    value: _vp, defaultValue: _dv,
    multiple = false, displayEmpty = false,
    renderValue: _rv, onChange: _oc,
    disabled = false, error = false,
    fullWidth = false, size = 'medium',
    variant = 'outlined', autoWidth = false,
    children, className = '', native = false,
    testId, name, onBlur, onFocus, label,
    sx: _sx, MenuProps: _mp, required: _rq,
    IconComponent: _ic, inputProps: _ip,
    ...rest
  } = props

  const state = useSelectLogic(props)
  const { containerRef, id, value, isOpen } = state

  if (native) {
    return <NativeSelectInner selectRef={ref} props={props} setInternalValue={state.setInternalValue} />
  }

  const dv = getDisplayValue(props, value)
  const hasValue = dv !== null && dv !== ''
  const cls = [
    styles.matSelect,
    variant === 'outlined' ? styles.outlined : '',
    variant === 'filled' ? styles.filled : '',
    variant === 'standard' ? styles.standard : '',
    size === 'small' ? styles.small : styles.medium,
    fullWidth ? styles.fullWidth : '',
    autoWidth ? styles.autoWidth : '',
    disabled ? styles.disabled : '',
    error ? styles.error : '',
    isOpen ? styles.open : '',
    hasValue || displayEmpty ? styles.hasValue : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div
      ref={(node) => {
        ;(containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      }}
      className={cls}
      {...rest}
      {...(testId ? { 'data-testid': testId } : {})}
    >
      <input type="hidden" name={name} value={multiple && Array.isArray(value) ? value.join(',') : String(value ?? '')} />
      <SelectTrigger
        id={id} isOpen={isOpen} disabled={disabled}
        required={props.required ?? false} label={label}
        hasValue={hasValue} displayEmpty={displayEmpty}
        displayValue={dv} IconComponent={props.IconComponent}
        onClick={() => !disabled && state.setIsOpen(!isOpen)}
        onKeyDown={(e) => handleKeyDown(e, state, disabled, containerRef)}
        onBlur={onBlur} onFocus={onFocus}
      />
      {isOpen && (
        <SelectMenu id={id} multiple={multiple} value={value}
          onSelect={(v) => handleSelect(v, state, props)}>
          {children}
        </SelectMenu>
      )}
    </div>
  )
})

Select.displayName = 'Select'
export default Select
