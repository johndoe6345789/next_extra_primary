'use client';

import React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import { Avatar } from '../atoms';
import type { LeaderboardEntry } from '@/types/gamification';

/** Props for LeaderboardRow. */
export interface LeaderboardRowProps {
  /** Leaderboard entry data. */
  entry: LeaderboardEntry;
}

/**
 * Single leaderboard table row with rank,
 * avatar, username, points, and level.
 */
export const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ entry: e }) => (
  <TableRow tabIndex={0} data-testid={`lb-${e.userId}`}>
    <TableCell>{e.rank}</TableCell>
    <TableCell>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Avatar alt={e.username} src={e.avatarUrl} size="sm" />
        {e.username}
      </Box>
    </TableCell>
    <TableCell>{e.points}</TableCell>
    <TableCell>{e.level}</TableCell>
  </TableRow>
);
