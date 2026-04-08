'use client'
/** Snackbar - temporary notification bar. */

import React from 'react'
import { classNames } from '../utils/classNames'
import styles
  from '../../../scss/atoms/mat-snackbar.module.scss'
import type { SnackbarProps }
  from './SnackbarTypes'
import { getPositionClass }
  from './SnackbarHelpers'
import { SnackbarContent }
  from './SnackbarContent'
import { useSnackbarState }
  from './useSnackbarState'

export type {
  SnackbarProps,
  SnackbarContentProps,
  SnackbarAnchorOrigin,
} from './SnackbarTypes'
export { SnackbarContent }
  from './SnackbarContent'

const s = (key: string): string =>
  styles[key] || key

/** Positioned notification bar. */
export const Snackbar: React.FC<
  SnackbarProps
> = ({
  children, open = false,
  anchorOrigin = {
    vertical: 'bottom',
    horizontal: 'left',
  },
  autoHideDuration = null, onClose,
  message, action,
  className = '', testId, ...props
}) => {
  const { visible, exiting } =
    useSnackbarState(
      open, autoHideDuration, onClose)
  if (!visible) return null
  const cls = classNames(
    styles.snackbarWrapper,
    getPositionClass(anchorOrigin),
    styles.snackbarAnimationsEnabled,
    {
      [styles.snackbarEnter]:
        open && !exiting,
      [styles.snackbarExit]: exiting,
    },
    className,
  )
  const content = children || (
    <SnackbarContent
      message={message}
      action={action} />
  )
  return (
    <div className={cls}
      data-testid={testId}
      role="status"
      aria-live="polite" {...props}>
      <div className={
        s('mat-mdc-snack-bar-container')
      }>
        <div className={
          s('mat-mdc-snackbar-surface')
        }>
          {content}
        </div>
      </div>
    </div>
  )
}
