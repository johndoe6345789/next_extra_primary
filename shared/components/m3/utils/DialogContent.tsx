'use client'

import React from 'react'
import styles from '../../../scss/atoms/mat-dialog.module.scss'

/** Props for the DialogContent component */
export interface DialogContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Content rendered inside the dialog body */
  children?: React.ReactNode
  /** Show top/bottom dividers */
  dividers?: boolean
}

/**
 * DialogContent - dialog body content wrapper.
 * Provides scrollable padding area between the title
 * and actions sections of a dialog.
 */
export const DialogContent: React.FC<DialogContentProps> = ({
  children,
  dividers,
  className = '',
  ...props
}) => (
  <>
    {dividers && <hr className={styles.dialogDivider} />}
    <div
      className={`${styles.dialogContent} ${className}`}
      data-testid="dialog-content"
      {...props}
    >
      {children}
    </div>
    {dividers && <hr className={styles.dialogDivider} />}
  </>
)

export default DialogContent
