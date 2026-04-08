'use client';
/**
 * TabPanel - content panel associated with a Tab.
 */

import React, { forwardRef } from 'react'
import styles from '../../../scss/atoms/mat-tabs.module.scss'

const s = (key: string): string => styles[key] || key

/** Props for a TabPanel */
export interface TabPanelProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  value?: string | number
  index?: number | string
  hidden?: boolean
  testId?: string
}

/** Content panel that shows when its tab is selected. */
export const TabPanel = forwardRef<
  HTMLDivElement,
  TabPanelProps
>(
  (
    {
      children,
      value,
      index,
      hidden,
      testId,
      className = '',
      ...props
    },
    ref,
  ) => {
    const isHidden =
      hidden ??
      (value !== undefined &&
        index !== undefined &&
        value !== index)
    if (isHidden) return null

    return (
      <div
        ref={ref}
        className={`${s('mat-mdc-tab-body')} ${styles.tabPanel} ${className}`.trim()}
        role="tabpanel"
        data-testid={testId}
        {...props}
      >
        {children}
      </div>
    )
  },
)

TabPanel.displayName = 'TabPanel'
