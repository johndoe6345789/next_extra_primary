'use client'

/**
 * ReactionsTab — look up reaction counts for a
 * target (type, id) pair.
 */

import { useState } from 'react'
import {
  Typography, Box, TextField, Button, Alert,
} from '@shared/m3'

interface Row {
  emoji: string
  count: number
}

export function ReactionsTab() {
  const [type, setType] = useState('comment')
  const [id, setId] = useState('')
  const [rows, setRows] = useState<Row[]>([])
  const [error, setError] =
    useState<string | null>(null)

  const load = async () => {
    try {
      const r = await fetch(
        '/social-admin/api/social/reactions' +
          `/summary?target_type=${type}` +
          `&target_id=${encodeURIComponent(id)}`,
        { credentials: 'include' },
      )
      const j = await r.json()
      setRows(j.summary ?? [])
      setError(null)
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'error',
      )
    }
  }

  return (
    <Box data-testid="reactions-tab">
      <TextField
        label="Target type"
        value={type}
        onChange={e => setType(e.target.value)}
        aria-label="Reaction target type"
      />
      <TextField
        label="Target id"
        value={id}
        onChange={e => setId(e.target.value)}
        aria-label="Reaction target id"
      />
      <Button onClick={load}>Load</Button>
      {error && (
        <Alert severity="error">{error}</Alert>
      )}
      <Typography variant="h6">Counts</Typography>
      <ul>
        {rows.map(r => (
          <li key={r.emoji}>
            {r.emoji}: {r.count}
          </li>
        ))}
      </ul>
    </Box>
  )
}
