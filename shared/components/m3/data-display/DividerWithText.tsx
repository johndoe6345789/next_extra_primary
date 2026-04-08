import React from 'react'
import { classNames } from '../utils/classNames'
import styles
  from '../../../scss/atoms/mat-divider.module.scss'

/** Props for DividerWithText. */
export interface DividerWithTextProps
  extends React.HTMLAttributes<
    HTMLDivElement
  > {
  children: React.ReactNode
  textAlign?: 'center' | 'start' | 'end'
  testId?: string
  className?: string
}

/** Divider with text content. */
export const DividerWithText: React.FC<
  DividerWithTextProps
> = ({
  children, textAlign = 'center',
  testId, className, ...props
}) => (
  <div className={classNames(
    styles.dividerWithText,
    {
      [styles.dividerWithTextStart]:
        textAlign === 'start',
      [styles.dividerWithTextEnd]:
        textAlign === 'end',
    }, className)}
    role="separator"
    data-testid={testId} {...props}>
    <span className={styles.dividerText}>
      {children}
    </span>
  </div>
)
