'use client'

/**
 * FollowsTab — inspect the follow graph for a
 * given user id.
 */

import { useState } from 'react'
import {
  Typography, TextField, Box, Alert,
} from '@shared/m3'
import { useFollows } from '@/hooks/useFollows'

export function FollowsTab() {
  const [uid, setUid] = useState('')
  const { following, followers, error } =
    useFollows(uid)

  return (
    <Box data-testid="follows-tab">
      <TextField
        label="User id (uuid)"
        value={uid}
        onChange={e => setUid(e.target.value)}
        aria-label="User id for follow lookup"
        fullWidth
      />
      {error && (
        <Alert severity="error">{error}</Alert>
      )}
      <Typography variant="h6">
        Following ({following.length})
      </Typography>
      <ul>
        {following.map(f => (
          <li key={`f-${f.user_id}`}>
            {f.user_id}
          </li>
        ))}
      </ul>
      <Typography variant="h6">
        Followers ({followers.length})
      </Typography>
      <ul>
        {followers.map(f => (
          <li key={`r-${f.user_id}`}>
            {f.user_id}
          </li>
        ))}
      </ul>
    </Box>
  )
}
