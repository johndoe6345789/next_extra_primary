'use client'

/**
 * Templates library view — shows the editable
 * template list and opens the TemplateEditor
 * on selection.  Power users edit subject/body
 * here without touching the database directly.
 */

import { useState } from 'react'
import {
  Button, List, ListItemButton, ListItemText,
  Typography,
} from '@shared/m3'
import {
  useTemplates, type NotifTemplate,
} from '@/hooks/useTemplates'
import { TemplateEditor } from './TemplateEditor'

export function TemplatesTab() {
  const { items, save, refresh } = useTemplates()
  const [active, setActive] =
    useState<NotifTemplate | null>(null)

  return (
    <div data-testid="templates-tab">
      <Typography variant="subtitle1">
        {items.length} template
        {items.length === 1 ? '' : 's'}
      </Typography>
      <List aria-label="Notification templates">
        {items.map((t) => (
          <ListItemButton
            key={t.key}
            onClick={() => setActive(t)}
            data-testid={`tmpl-${t.key}`}
          >
            <ListItemText
              primary={t.key}
              secondary={`${t.channel} · ` +
                `${t.subject}`}
            />
          </ListItemButton>
        ))}
      </List>
      <Button
        variant="outlined"
        onClick={() =>
          setActive({
            key: '', channel: 'email',
            subject: '', body: '',
          })
        }
        data-testid="new-template"
      >
        New template
      </Button>
      {active && (
        <TemplateEditor
          value={active}
          onClose={() => setActive(null)}
          onSave={async (t) => {
            await save(t)
            setActive(null)
            refresh()
          }}
        />
      )}
    </div>
  )
}
