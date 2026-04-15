'use client'

/**
 * PrefsTab — operator view of a specific
 * user's per-channel notification prefs.
 * Useful for supporting opt-out requests
 * without having to SQL into the database.
 */

import { useState } from 'react'
import {
  TextField, Button, Switch, Typography,
} from '@shared/m3'
import { usePrefs } from '@/hooks/usePrefs'

const CHANNELS = [
  'email', 'webhook', 'inapp', 'push',
]

export function PrefsTab() {
  const [user, setUser] = useState('')
  const { items, load, toggle } = usePrefs()

  const enabled = (c: string) =>
    items.find((i) => i.channel === c)
      ?.enabled ?? true

  return (
    <div data-testid="prefs-tab">
      <Typography variant="subtitle1">
        Per-user notification preferences
      </Typography>
      <TextField
        label="User UUID"
        value={user}
        onChange={(e) => setUser(e.target.value)}
        inputProps={{
          'data-testid': 'prefs-user',
        }}
      />
      <Button
        variant="outlined"
        onClick={() => load(user)}
        data-testid="prefs-load"
      >
        Load
      </Button>
      {CHANNELS.map((c) => (
        <div key={c}>
          <Typography variant="body1">
            {c}
          </Typography>
          <Switch
            checked={enabled(c)}
            onChange={(_, v) =>
              toggle(user, c, v)}
            inputProps={{
              'data-testid': `prefs-${c}`,
              'aria-label': `${c} channel`,
            }}
          />
        </div>
      ))}
    </div>
  )
}
