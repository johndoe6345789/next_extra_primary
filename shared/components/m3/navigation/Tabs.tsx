'use client';

/**
 * Tabs - Material Design 3 tab group container.
 *
 * Tab and TabPanel live in sibling files (`TabParts.tsx`,
 * `TabPanel.tsx`) and are re-exported to keep `Tabs.tsx`
 * under the 100-LOC project limit. The keyboard handler
 * lives in `tabs_keyboard.ts`.
 */

import React, { forwardRef } from 'react'
import styles from '../../../scss/atoms/mat-tabs.module.scss'
import { handleTabsKeyDown } from './tabs_keyboard'

export { Tab, type TabProps } from './TabParts'
export { TabPanel, type TabPanelProps } from './TabPanel'
import type { TabProps } from './TabParts'

const s = (key: string): string => styles[key] || key

/** Props for the Tabs container. */
export interface TabsProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'onChange'
  > {
  children?: React.ReactNode
  value?: string | number
  onChange?: (
    event: React.SyntheticEvent,
    value: string | number,
  ) => void
  /** Simple value-change callback (no SyntheticEvent). */
  onValueChange?: (value: string | number) => void
  variant?:
    | 'standard'
    | 'scrollable'
    | 'fullWidth'
    | 'secondary'
    | 'centered'
  fullWidth?: boolean
  testId?: string
}

/** Material tab group container. */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      children,
      value,
      onChange,
      onValueChange,
      variant,
      fullWidth,
      testId,
      className = '',
      ...props
    },
    ref,
  ) => {
    const variantClasses = [
      variant === 'secondary' && styles.secondary,
      variant === 'scrollable' && styles.scrollable,
      variant === 'centered' && styles.centered,
      (variant === 'fullWidth' || fullWidth) && styles.fullWidth,
    ]
      .filter(Boolean)
      .join(' ')
    const cls =
      `${s('mat-mdc-tab-group')} ${styles.matTabs} ` +
      `${variantClasses} ${className}`
    const tabs = React.Children.map(children, (child) => {
      if (!React.isValidElement<TabProps>(child)) {
        return child
      }
      const childValue = child.props.value as string | number | undefined
      const selected = childValue === value
      return React.cloneElement(child, {
        selected,
        onClick: (
          event: React.MouseEvent<HTMLButtonElement>,
        ) => {
          child.props.onClick?.(event)
          if (childValue === undefined) {
            return
          }
          onChange?.(event, childValue)
          onValueChange?.(childValue)
        },
      })
    })
    return (
      <div
        ref={ref}
        className={cls.trim()}
        role="tablist"
        data-testid={testId}
        onKeyDown={handleTabsKeyDown}
        {...props}
      >
        <div className={s('mat-mdc-tab-header')}>
          <div className={s('mat-mdc-tab-label-container')}>
            <div className={s('mat-mdc-tab-list')}>
              <div className={s('mat-mdc-tab-labels')}>
                {tabs}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
)

Tabs.displayName = 'Tabs'
