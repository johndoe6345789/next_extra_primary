'use client';

import React from 'react'
import { RecipientInput } from '../inputs'

export interface ComposeCcBccProps {
  cc: string[]
  bcc: string[]
  showCcBcc: boolean
  onCcChange: (v: string[]) => void
  onBccChange: (v: string[]) => void
}

/**
 * Cc and Bcc recipient input fields shown
 * when expanded in the compose window.
 */
export const ComposeCcBcc = ({
  cc, bcc, showCcBcc,
  onCcChange, onBccChange,
}: ComposeCcBccProps) => {
  if (!showCcBcc) return null
  return (
    <>
      <RecipientInput recipientType="cc"
        recipients={cc}
        onRecipientsChange={onCcChange}
        placeholder="Cc:" />
      <RecipientInput recipientType="bcc"
        recipients={bcc}
        onRecipientsChange={onBccChange}
        placeholder="Bcc:" />
    </>
  )
}
