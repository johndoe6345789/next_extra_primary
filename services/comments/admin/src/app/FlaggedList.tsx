'use client';

/**
 * @file FlaggedList.tsx
 * @brief Renders a list of flagged comments
 *        for moderator inspection. M3 only.
 */

import {
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemButton,
  Stack,
  Typography,
} from '@shared/m3';

import type { FlaggedComment }
  from '@/hooks/useFlagged';

export interface FlaggedListProps {
  items: FlaggedComment[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

/**
 * @brief List of flagged comments. Selecting
 *        a row raises onSelect with its id.
 */
export function FlaggedList({
  items, selectedId, onSelect,
}: FlaggedListProps) {
  if (items.length === 0) {
    return (
      <Card data-testid="flagged-empty">
        <CardContent>
          <Typography>
            Nothing flagged right now.
          </Typography>
        </CardContent>
      </Card>
    );
  }
  return (
    <List
      data-testid="flagged-list"
      aria-label="Flagged comments"
    >
      {items.map((c) => (
        <ListItem
          key={c.id}
          disablePadding
        >
          <ListItemButton
            selected={selectedId === c.id}
            onClick={() => onSelect(c.id)}
            data-testid={`flagged-${c.id}`}
          >
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
            >
              <Chip
                label={`${c.flag_count} flags`}
                color="error"
                size="small"
              />
              <Typography variant="body2">
                {c.body.slice(0, 120)}
              </Typography>
            </Stack>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
