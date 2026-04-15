'use client'

/**
 * PollList — left column of the polls
 * operator screen.  Renders the list of
 * active polls as M3 List rows and emits
 * a selection event upstream.
 */

import {
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from '@shared/m3'
import type { PollRow } from '@/hooks/usePolls'

/** Props for PollList. */
export interface PollListProps {
  rows: PollRow[]
  selected: number | null
  onSelect: (id: number) => void
}

export function PollList({
  rows, selected, onSelect,
}: PollListProps) {
  if (rows.length === 0) {
    return (
      <div
        className="polls-card"
        data-testid="polls-empty"
        aria-label="No polls"
      >
        <Typography variant="body1">
          No polls yet — create one above.
        </Typography>
      </div>
    )
  }

  return (
    <List
      className="polls-list"
      aria-label="Active polls"
      testId="polls-list"
    >
      {rows.map(p => (
        <ListItemButton
          key={p.id}
          onClick={() => onSelect(p.id)}
          aria-selected={selected === p.id}
          data-testid={`poll-row-${p.id}`}
        >
          <ListItemText
            primary={p.question}
            secondary={
              `${p.kind} · closes ${p.closes_at}`
            }
          />
        </ListItemButton>
      ))}
    </List>
  )
}
