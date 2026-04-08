'use client'

import type React from 'react'
import {
  useState, useEffect, useCallback,
} from 'react'

type CloseReason =
  | 'timeout'
  | 'clickaway'
  | 'escapeKeyDown'

/**
 * Manages Snackbar visibility, auto-hide,
 * exit animation, and escape key handling.
 * @param open - Whether snackbar is open.
 * @param autoHideDuration - Auto-hide ms.
 * @param onClose - Close callback.
 * @returns visible, exiting state flags.
 */
export function useSnackbarState(
  open: boolean,
  autoHideDuration: number | null,
  onClose?: (
    event: React.SyntheticEvent
      | Event | null,
    reason: CloseReason,
  ) => void,
) {
  const [exiting, setExiting] = useState(false)
  const [visible, setVisible] = useState(false)

  const handleClose = useCallback(
    (reason: CloseReason) => {
      onClose?.(null, reason)
    }, [onClose],
  )

  useEffect(() => {
    if (open) {
      setVisible(true); setExiting(false)
    }
  }, [open])

  useEffect(() => {
    if (!open || autoHideDuration === null)
      return
    const t = setTimeout(
      () => handleClose('timeout'),
      autoHideDuration)
    return () => clearTimeout(t)
  }, [open, autoHideDuration, handleClose])

  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape')
        handleClose('escapeKeyDown')
    }
    document.addEventListener('keydown', h)
    return () =>
      document.removeEventListener(
        'keydown', h)
  }, [open, handleClose])

  useEffect(() => {
    if (!open && visible) {
      setExiting(true)
      const t = setTimeout(() => {
        setVisible(false); setExiting(false)
      }, 75)
      return () => clearTimeout(t)
    }
    return undefined
  }, [open, visible])

  return { visible, exiting }
}
