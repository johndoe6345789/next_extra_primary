'use client'

/**
 * PresenceTab — bulk-read presence for a list of
 * comma-separated user ids.
 */

import { useMemo, useState } from 'react'
import {
  Typography, Box, TextField, Chip, Alert,
} from '@shared/m3'
import { usePresence } from '@/hooks/usePresence'

export function PresenceTab() {
  const [raw, setRaw] = useState('')
  const users = useMemo(
    () =>
      raw
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
    [raw],
  )
  const { statuses, error } = usePresence(users)

  return (
    <Box data-testid="presence-tab">
      <TextField
        label="User ids (comma-separated)"
        value={raw}
        onChange={e => setRaw(e.target.value)}
        aria-label="Presence lookup user ids"
        fullWidth
      />
      {error && (
        <Alert severity="error">{error}</Alert>
      )}
      <Typography variant="h6">Statuses</Typography>
      <ul>
        {users.map(u => (
          <li key={u}>
            <code>{u.slice(0, 8)}</code>:{' '}
            <Chip
              label={statuses[u] ?? 'offline'}
              size="small"
              aria-label={
                `Presence status for ${u}`
              }
            />
          </li>
        ))}
      </ul>
    </Box>
  )
}
