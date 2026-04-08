'use client';
import React, { forwardRef } from 'react'
import { classNames } from '../utils/classNames'
import { ButtonBaseProps } from './InputBaseTypes'

export type { ButtonBaseProps } from './InputBaseTypes'

/**
 * ButtonBase - minimal interactive base element
 */
export const ButtonBase = forwardRef<
  HTMLElement,
  ButtonBaseProps
>(function ButtonBase(
  {
    component: Component = 'button',
    className,
    disabled = false,
    children,
    onClick,
    onFocus,
    onBlur,
    tabIndex = 0,
    type = 'button',
    ...props
  },
  ref
) {
  return (
    <Component
      ref={ref}
      className={classNames(
        'm3-button-base',
        className,
        { 'm3-button-base-disabled': disabled }
      )}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      tabIndex={disabled ? -1 : tabIndex}
      type={
        Component === 'button' ? type : undefined
      }
      {...props}
    >
      {children}
    </Component>
  )
})
