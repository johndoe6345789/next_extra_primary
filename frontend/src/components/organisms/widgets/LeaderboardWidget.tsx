'use client';

import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { useGamification } from '@/hooks';

/**
 * Dashboard widget showing a compact leaderboard
 * list of top users.
 */
export default function LeaderboardWidget() {
  const { leaderboard } = useGamification();
  const top = leaderboard.slice(0, 10);

  return (
    <Box data-testid="leaderboard-widget">
      {top.length === 0 ? (
        <Typography
          variant="body2"
          color="text.secondary"
        >
          No leaderboard data
        </Typography>
      ) : (
        top.map((e) => (
          <Box
            key={e.userId}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              py: 0.5,
            }}
          >
            <Typography variant="body2">
              {`#${e.rank} ${e.displayName}`}
            </Typography>
            <Typography variant="body2">
              {`${e.points} pts`}
            </Typography>
          </Box>
        ))
      )}
    </Box>
  );
}
