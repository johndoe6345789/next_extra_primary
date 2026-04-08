import React from 'react'
import styles from '../../../scss/atoms/mat-dialog.module.scss'

// Re-export all dialog parts
export {
  DialogOverlay,
  type DialogOverlayProps,
  DialogPanel,
  type DialogPanelProps,
} from './DialogBase'

export {
  DialogHeader,
  type DialogHeaderProps,
  DialogTitle,
  type DialogTitleProps,
  DialogContent,
  type DialogContentProps,
  DialogContentText,
  type DialogContentTextProps,
  DialogActions,
  type DialogActionsProps,
} from './DialogParts'

export interface DialogCloseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
}

/** Close button for a dialog. */
export const DialogClose: React.FC<
  DialogCloseProps
> = ({ children, className = '', ...props }) => (
  <button
    type="button"
    className={`${styles.dialogClose} ${className}`}
    aria-label="Close dialog"
    {...props}
  >
    {children}
  </button>
)

export interface DialogIconProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

/** Icon container for a dialog header. */
export const DialogIcon: React.FC<
  DialogIconProps
> = ({ children, className = '', ...props }) => (
  <div
    className={`${styles.dialogIcon} ${className}`}
    {...props}
  >
    {children}
  </div>
)

/**
 * Component host class for dialog flex layout.
 */
export const DialogComponentHostClass =
  'mat-mdc-dialog-component-host'
