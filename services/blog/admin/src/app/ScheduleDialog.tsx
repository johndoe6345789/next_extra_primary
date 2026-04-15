'use client'

/**
 * ScheduleDialog — prompts the operator for
 * an ISO-8601 timestamp and confirms it.
 * Uses M3 dialog primitives; no raw dialog.
 */

import { useState } from 'react'

import {
  M3Button,
  M3Dialog,
  M3TextField,
} from '@shared/m3'

export interface ScheduleDialogProps {
  /** Called if the user cancels. */
  onCancel: () => void
  /** Called with the chosen ISO timestamp. */
  onConfirm: (when: string) => void | Promise<void>
}

export function ScheduleDialog(
  { onCancel, onConfirm }: ScheduleDialogProps,
) {
  const [when, setWhen] = useState('')
  return (
    <M3Dialog
      open
      onClose={onCancel}
      data-testid="schedule-dialog"
      aria-label="Schedule article"
    >
      <M3TextField
        label="Publish at (ISO 8601)"
        value={when}
        onChange={setWhen}
        data-testid="schedule-when"
      />
      <M3Button
        data-testid="schedule-cancel"
        onClick={onCancel}
      >
        Cancel
      </M3Button>
      <M3Button
        data-testid="schedule-confirm"
        onClick={() => onConfirm(when)}
      >
        Schedule
      </M3Button>
    </M3Dialog>
  )
}
