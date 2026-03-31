'use client'

import React from 'react'
import styles from '../../../scss/atoms/mat-dialog.module.scss'

/** Props for the DialogTitle component */
export interface DialogTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Title text or elements */
  children?: React.ReactNode
}

/**
 * DialogTitle - dialog title wrapper.
 * Renders an h2 heading styled for the dialog surface.
 */
export const DialogTitle: React.FC<DialogTitleProps> = ({
  children,
  className = '',
  id,
  ...props
}) => (
  <h2
    className={`${styles.dialogTitle} ${className}`}
    id={id}
    data-testid="dialog-title"
    {...props}
  >
    {children}
  </h2>
)

export default DialogTitle
