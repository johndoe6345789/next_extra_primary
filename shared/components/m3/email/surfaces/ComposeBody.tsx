'use client';

import React from 'react'
import { Box } from '../..'
import { RecipientInput, BodyEditor }
  from '../inputs'
import { ComposeCcBcc } from './ComposeCcBcc'

export interface ComposeBodyProps {
  to: string[]
  cc: string[]
  bcc: string[]
  subject: string
  body: string
  showCcBcc: boolean
  onToChange: (v: string[]) => void
  onCcChange: (v: string[]) => void
  onBccChange: (v: string[]) => void
  onSubjectChange: (v: string) => void
  onBodyChange: (v: string) => void
  onShowCcBcc: () => void
}

/**
 * Compose email body with recipients,
 * subject field, and body editor.
 */
export const ComposeBody = ({
  to, cc, bcc, subject, body,
  showCcBcc, onToChange, onCcChange,
  onBccChange, onSubjectChange,
  onBodyChange, onShowCcBcc,
}: ComposeBodyProps) => (
  <Box className="compose-body">
    <Box style={{
      display: 'flex',
      alignItems: 'center', gap: '8px',
    }}>
      <RecipientInput recipientType="to"
        recipients={to}
        onRecipientsChange={onToChange}
        placeholder="To:" />
      {!showCcBcc && (
        <button type="button"
          onClick={onShowCcBcc}
          style={{
            fontSize: '0.75rem',
            color:
              'var(--mat-sys-on-surface-variant)',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            padding: '4px 6px',
          }}
          aria-label="Show Cc and Bcc fields">
          Cc/Bcc
        </button>
      )}
    </Box>
    <ComposeCcBcc cc={cc} bcc={bcc}
      showCcBcc={showCcBcc}
      onCcChange={onCcChange}
      onBccChange={onBccChange} />
    <input type="text"
      placeholder="Subject"
      value={subject} id="compose-subject"
      aria-label="Subject"
      data-testid="compose-subject"
      onChange={(e) =>
        onSubjectChange(e.target.value)}
      className="compose-subject" />
    <BodyEditor value={body}
      onChange={(e) =>
        onBodyChange(e.target.value)} />
  </Box>
)
