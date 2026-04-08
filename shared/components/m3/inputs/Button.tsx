'use client';
import React, { forwardRef } from 'react'
import { useAccessible } from '../../../hooks/useAccessible'
import styles from '../../../scss/atoms/mat-button.module.scss'
import { ButtonProps } from './ButtonTypes'
import { s, getButtonClass, getColorClass } from './buttonHelpers'
import { ButtonContent } from './ButtonContent'

export type { ButtonVariant, ButtonSize, ButtonProps } from './ButtonTypes'

/**
 * Button component using Angular Material M3 styles
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const {
      children, variant, size, color,
      primary, secondary, outline, ghost,
      sm, lg, icon, loading, fullWidth,
      startIcon, endIcon, disabled,
      className = '', type = 'button',
      testId: customTestId, sx,
      component: Component, href, edge,
      'aria-busy': ariaBusy,
      'aria-label': ariaLabel,
      ...restProps
    } = props

    const accessible = useAccessible({
      feature: 'form',
      component: 'button',
      identifier: customTestId || String(children)?.substring(0, 20),
    })

    const isDisabled = disabled || loading
    const classes = [
      s('mdc-button'), s('mat-mdc-button-base'),
      s(getButtonClass(props)), s(getColorClass(props)),
      isDisabled ? s('mat-mdc-button-disabled') : '',
      fullWidth ? styles.fullWidth : '', className,
    ].filter(Boolean).join(' ')

    const Element = Component || 'button'
    const elProps = Component ? { ...restProps, href } : { ...restProps, type }

    const sizeStyle: Record<string, string> = {}
    const norm = size === 'small' ? 'sm' : size === 'large' ? 'lg' : size
    if (norm === 'sm' || sm) {
      sizeStyle['--mat-button-text-container-height'] = '32px'
    } else if (norm === 'lg' || lg) {
      sizeStyle['--mat-button-text-container-height'] = '48px'
    }

    return (
      <Element
        ref={ref}
        className={classes}
        disabled={isDisabled}
        data-testid={accessible['data-testid']}
        aria-label={ariaLabel || accessible['aria-label']}
        aria-busy={ariaBusy ?? loading}
        aria-disabled={isDisabled}
        style={sizeStyle}
        {...elProps}
      >
        <ButtonContent loading={loading} startIcon={startIcon} endIcon={endIcon}>
          {children}
        </ButtonContent>
      </Element>
    )
  }
)

Button.displayName = 'Button'
export default Button
