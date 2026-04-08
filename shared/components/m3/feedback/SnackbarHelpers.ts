/**
 * Snackbar positioning helpers.
 */

import styles from '../../../scss/atoms/mat-snackbar.module.scss'
import type { SnackbarAnchorOrigin } from './SnackbarTypes'

/**
 * Map anchor origin to a positioning CSS class.
 */
export function getPositionClass(
  anchorOrigin: SnackbarAnchorOrigin,
): string | undefined {
  const {
    vertical = 'bottom',
    horizontal = 'left',
  } = anchorOrigin

  if (vertical === 'top') {
    if (horizontal === 'left') {
      return styles.snackbarTopLeft
    }
    if (horizontal === 'right') {
      return styles.snackbarTopRight
    }
    return styles.snackbarTop
  }

  if (horizontal === 'left') {
    return styles.snackbarBottomLeft
  }
  if (horizontal === 'right') {
    return styles.snackbarBottomRight
  }
  return styles.snackbarBottom
}
