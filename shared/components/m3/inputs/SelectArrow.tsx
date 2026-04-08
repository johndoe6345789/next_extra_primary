import React from 'react'
import styles
  from '../../../scss/atoms/mat-select.module.scss'

/** Props for SelectArrowIcon. */
export interface SelectArrowProps {
  IconComponent?: React.ComponentType<{
    className?: string
  }>
}

/** Dropdown arrow icon for Select trigger. */
export function SelectArrowIcon({
  IconComponent,
}: SelectArrowProps) {
  return (
    <span className={styles.arrowWrapper}>
      {IconComponent ? (
        <IconComponent
          className={styles.arrow} />
      ) : (
        <span className={styles.arrow}>
          <svg viewBox="0 0 24 24"
            width="24" height="24"
            fill="currentColor">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </span>
      )}
    </span>
  )
}
