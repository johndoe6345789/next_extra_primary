import React from 'react'
import styles
  from '../../../scss/atoms/mat-dialog.module.scss'

export interface DialogActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  stacked?: boolean
  align?: 'start' | 'center' | 'end'
}

/** Action button row at the bottom of dialog. */
export const DialogActions: React.FC<
  DialogActionsProps
> = ({
  children, stacked, align,
  className = '', ...props
}) => {
  const alignClass =
    align === 'start'
      ? styles.dialogActionsStart
      : align === 'center'
        ? styles.dialogActionsCenter
        : ''
  const stackedClass = stacked
    ? styles.dialogActionsStacked
    : ''

  return (
    <div
      className={`${styles.dialogActions} ${alignClass} ${stackedClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
