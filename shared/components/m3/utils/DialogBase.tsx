import React from 'react'
import styles
  from '../../../scss/atoms/mat-dialog.module.scss'

export {
  DialogOverlay,
  type DialogOverlayProps,
} from './DialogOverlay'

/** Props for the DialogPanel component. */
export interface DialogPanelProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  sm?: boolean
  lg?: boolean
  xl?: boolean
  fullScreen?: boolean
  fullWidth?: boolean
  open?: boolean
  hasActions?: boolean
  testId?: string
  'aria-labelledby'?: string
}

/** Main dialog panel container. */
export const DialogPanel: React.FC<
  DialogPanelProps
> = ({
  children, sm, lg, xl, fullScreen,
  fullWidth, open = true, hasActions,
  testId, 'aria-labelledby': ariaLabelledBy,
  className = '', ...props
}) => {
  const sizeClass = sm
    ? styles.dialogPanelSm
    : lg ? styles.dialogPanelLg
      : xl ? styles.dialogPanelXl : ''
  const fsClass = fullScreen
    ? styles.dialogPanelFullscreen : ''
  const openClass = open
    ? styles.dialogOpen : ''
  return (
    <div className={openClass} {...props}>
      <div className={
        `${styles.dialogContainer} ${sizeClass} ${fsClass} ${className}`
      }
        style={fullWidth
          ? { width: '100%' }
          : undefined}
        onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        data-testid={testId} tabIndex={-1}>
        <div className={
          styles.dialogInnerContainer
        }>
          <div className={
            styles.dialogSurface
          }>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
