'use client';

import React from 'react'
import { Box, BoxProps, Button, Card }
  from '../..'
import {
  useAccessible, useFocusTrap,
} from '../../../../hooks/useAccessible'
import { MaterialIcon }
  from '../../../../icons/react/m3'
import { ComposeBody } from './ComposeBody'
import { ComposeHeader } from './ComposeHeader'
import { useComposeWindow }
  from './useComposeWindow'

export interface ComposeWindowProps
  extends BoxProps {
  onSend?: (data: {
    to: string[]; cc?: string[];
    bcc?: string[]; subject: string;
    body: string;
  }) => void
  onClose?: () => void
  testId?: string
}

/**
 * Compose email dialog with recipients,
 * subject, body, and send/cancel actions.
 */
export const ComposeWindow = ({
  onSend, onClose,
  testId: customTestId, ...props
}: ComposeWindowProps) => {
  const s = useComposeWindow(onClose)
  const accessible = useAccessible({
    feature: 'email', component: 'compose',
    identifier: customTestId || 'compose',
  })
  const { focusTrapRef: trapRef } =
    useFocusTrap(true)
  const handleSend = () => {
    if (s.to.length > 0 && s.subject && s.body)
      onSend?.({
        to: s.to, cc: s.cc, bcc: s.bcc,
        subject: s.subject, body: s.body,
      })
  }
  return (
    <Card ref={trapRef}
      className="compose-window"
      role="dialog" aria-modal={true}
      aria-labelledby="compose-dialog-title"
      {...accessible} {...props}>
      <ComposeHeader onClose={onClose} />
      <ComposeBody
        to={s.to} cc={s.cc} bcc={s.bcc}
        subject={s.subject} body={s.body}
        showCcBcc={s.showCcBcc}
        onToChange={s.setTo}
        onCcChange={s.setCc}
        onBccChange={s.setBcc}
        onSubjectChange={s.setSubject}
        onBodyChange={s.setBody}
        onShowCcBcc={() =>
          s.setShowCcBcc(true)} />
      <Box className="compose-footer">
        <Button variant="primary"
          onClick={handleSend}
          data-testid="compose-send-btn">
          <MaterialIcon name="send" /> Send
        </Button>
        <Button variant="outline"
          onClick={onClose}
          data-testid="compose-cancel-btn">
          Cancel
        </Button>
      </Box>
    </Card>
  )
}
