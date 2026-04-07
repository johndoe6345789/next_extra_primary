'use client';

import React, { useState } from 'react';
import Table from '@shared/m3/Table';
import TableBody from '@shared/m3/TableBody';
import TableCell from '@shared/m3/TableCell';
import TableContainer from '@shared/m3/TableContainer';
import TableHead from '@shared/m3/TableHead';
import TableRow from '@shared/m3/TableRow';
import TableSortLabel from '@shared/m3/TableSortLabel';
import Paper from '@shared/m3/Paper';
import Box from '@shared/m3/Box';
import { useTranslations } from 'next-intl';
import { useGamification } from '@/hooks';
import { LeaderboardRow } from './LeaderboardRow';
import { PeriodFilter } from './PeriodFilter';

type SK = 'rank' | 'points' | 'level';

/** Props for the LeaderboardTable organism. */
export interface LeaderboardTableProps {
  testId?: string;
}

/**
 * Sortable leaderboard with period filter.
 *
 * @param props - Component props.
 */
export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  testId = 'leaderboard-table',
}) => {
  const tg = useTranslations('gamification');
  const td = useTranslations('dashboard');
  const { leaderboard } = useGamification();
  const [sk, setSk] = useState<SK>('rank');
  const [asc, setAsc] = useState(true);
  const rows = [...leaderboard].sort(
    (a, b) => (a[sk] - b[sk]) * (asc ? 1 : -1),
  );
  const tog = (k: SK) => {
    if (sk === k) setAsc(!asc);
    else {
      setSk(k);
      setAsc(true);
    }
  };
  const labels: Record<SK, string> = {
    rank: td('rank'),
    points: tg('points'),
    level: tg('level'),
  };
  const hdr = (k: SK) => (
    <TableCell key={k}>
      <TableSortLabel
        active={sk === k}
        direction={asc ? 'asc' : 'desc'}
        onClick={() => tog(k)}
      >
        {labels[k]}
      </TableSortLabel>
    </TableCell>
  );

  return (
    <Box data-testid={testId}>
      <PeriodFilter />
      <TableContainer component={Paper}>
        <Table aria-label={tg('leaderboard')} role="grid">
          <TableHead>
            <TableRow>
              {hdr('rank')}
              <TableCell>User</TableCell>
              {hdr('points')}
              {hdr('level')}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((e) => (
              <LeaderboardRow key={e.userId} entry={e} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LeaderboardTable;
