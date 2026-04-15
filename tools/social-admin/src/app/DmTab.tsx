'use client'

/**
 * DmTab — inspect DM threads and their messages.
 */

import { useState } from 'react'
import {
  Typography, Box, Button, Alert,
} from '@shared/m3'
import { useDms } from '@/hooks/useDms'

export function DmTab() {
  const [active, setActive] =
    useState<number | null>(null)
  const { threads, messages, error } = useDms(active)

  return (
    <Box data-testid="dm-tab">
      {error && (
        <Alert severity="error">{error}</Alert>
      )}
      <Typography variant="h6">
        Threads ({threads.length})
      </Typography>
      <ul>
        {threads.map(t => (
          <li key={t.id}>
            <Button
              size="small"
              onClick={() => setActive(t.id)}
              aria-label={`Open thread ${t.id}`}
            >
              #{t.id} — {t.a.slice(0, 8)} /
              {' '}{t.b.slice(0, 8)}
            </Button>
          </li>
        ))}
      </ul>
      {active !== null && (
        <Box>
          <Typography variant="h6">
            Messages in #{active}
          </Typography>
          <ul>
            {messages.map(m => (
              <li key={m.id}>
                <code>
                  {m.sender.slice(0, 8)}
                </code>
                : {m.body}
              </li>
            ))}
          </ul>
        </Box>
      )}
    </Box>
  )
}
