import React from 'react'
import styles
  from '../../../scss/atoms/mat-dialog.module.scss'

/** Props for the DialogOverlay component. */
export interface DialogOverlayProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

/** Full-screen overlay behind a dialog. */
export const DialogOverlay: React.FC<
  DialogOverlayProps
> = ({
  children, onClick,
  className = '', ...props
}) => (
  <div
    className={
      `${styles.dialogOverlay} ${className}`
    }
    onClick={onClick}
    {...props}
  >
    {children}
  </div>
)
