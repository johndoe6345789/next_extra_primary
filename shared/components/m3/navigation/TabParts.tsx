'use client';
/**
 * Tab button sub-component for the Tabs group.
 */

import React, { forwardRef } from 'react'
import styles from '../../../scss/atoms/mat-tabs.module.scss'

const s = (key: string): string => styles[key] || key

/** Props for an individual Tab button */
export interface TabProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
  label?: React.ReactNode
  icon?: React.ReactNode
  value?: any
  selected?: boolean
  disabled?: boolean
  testId?: string
}

/** A single tab button inside a Tabs group. */
export const Tab = forwardRef<HTMLButtonElement, TabProps>(
  (
    {
      children, label, icon, value,
      selected, disabled, testId,
      className = '', ...props
    },
    ref,
  ) => {
    const cls = [
      s('mdc-tab'), s('mat-mdc-tab'),
      icon ? styles.tabWithIcon : '',
      selected ? s('mdc-tab--active') : '',
      disabled ? s('mat-mdc-tab-disabled') : '',
      className,
    ].filter(Boolean).join(' ')

    return (
      <button
        ref={ref} className={cls}
        role="tab" aria-selected={selected}
        aria-disabled={disabled} disabled={disabled}
        tabIndex={selected ? 0 : -1}
        data-testid={testId} {...props}
      >
        <span className={`${s('mdc-tab__ripple')} ${s('mat-mdc-tab-ripple')}`} />
        <span className={s('mdc-tab__content')}>
          {icon && <span className={styles.tabIcon}>{icon}</span>}
          <span className={s('mdc-tab__text-label')}>{label || children}</span>
        </span>
        <span className={s('mdc-tab-indicator')}>
          <span className={`${s('mdc-tab-indicator__content')} ${s('mdc-tab-indicator__content--underline')} ${selected ? s('mdc-tab-indicator--active') : ''}`} />
        </span>
      </button>
    )
  },
)

Tab.displayName = 'Tab'
