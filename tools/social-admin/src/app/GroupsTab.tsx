'use client'

/**
 * GroupsTab — browse all groups/teams.
 */

import {
  Typography, Box, Alert, Chip,
} from '@shared/m3'
import { useGroups } from '@/hooks/useGroups'

export function GroupsTab() {
  const { groups, loading, error } = useGroups()
  if (loading) {
    return (
      <Typography>Loading groups…</Typography>
    )
  }
  return (
    <Box data-testid="groups-tab">
      {error && (
        <Alert severity="error">{error}</Alert>
      )}
      <Typography variant="h6">
        Groups ({groups.length})
      </Typography>
      {groups.length === 0 ? (
        <Typography>
          No groups defined.
        </Typography>
      ) : (
        <ul>
          {groups.map(g => (
            <li key={g.id}>
              <Chip
                label={g.slug}
                size="small"
                aria-label={`Group ${g.slug}`}
              />{' '}
              <strong>{g.name}</strong> —{' '}
              {g.description}
            </li>
          ))}
        </ul>
      )}
    </Box>
  )
}
