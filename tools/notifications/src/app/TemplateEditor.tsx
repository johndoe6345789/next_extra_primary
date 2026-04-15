'use client'

/**
 * TemplateEditor — minimal M3 form for
 * creating or updating a notification
 * template.  Renders inside the TemplatesTab
 * and calls `onSave` with the fully-formed
 * template record.
 */

import { TextField, Button, Card } from '@shared/m3'
import { useState } from 'react'
import type {
  NotifTemplate,
} from '@/hooks/useTemplates'

export interface TemplateEditorProps {
  value: NotifTemplate
  onSave: (t: NotifTemplate) => void
  onClose: () => void
}

export function TemplateEditor({
  value, onSave, onClose,
}: TemplateEditorProps) {
  const [form, setForm] =
    useState<NotifTemplate>(value)

  const update = <K extends keyof NotifTemplate>(
    k: K, v: NotifTemplate[K],
  ) => setForm({ ...form, [k]: v })

  return (
    <Card
      className="notif-editor"
      data-testid="template-editor"
      aria-label="Template editor"
    >
      <TextField
        label="Key"
        value={form.key}
        onChange={(e) =>
          update('key', e.target.value)}
        inputProps={{
          'data-testid': 'tmpl-key',
        }}
      />
      <TextField
        label="Channel"
        value={form.channel}
        onChange={(e) =>
          update('channel', e.target.value)}
      />
      <TextField
        label="Subject"
        value={form.subject}
        onChange={(e) =>
          update('subject', e.target.value)}
      />
      <TextField
        label="Body"
        value={form.body}
        multiline
        minRows={4}
        onChange={(e) =>
          update('body', e.target.value)}
      />
      <div>
        <Button
          variant="filled"
          onClick={() => onSave(form)}
          data-testid="tmpl-save"
        >
          Save
        </Button>
        <Button
          variant="text"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </Card>
  )
}
