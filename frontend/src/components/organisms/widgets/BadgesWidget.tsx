'use client';

import Box from '@shared/m3/Box';
import Grid from '@shared/m3/Grid';
import Typography from '@shared/m3/Typography';
import Skeleton from '@shared/m3/Skeleton';
import { useGamification } from '@/hooks';

/**
 * Dashboard widget showing earned badges in a
 * compact grid with earned/total count.
 */
export default function BadgesWidget() {
  const { badges, isLoading } = useGamification();

  if (isLoading) {
    return (
      <Box data-testid="badges-widget-loading">
        <Skeleton width="100%" height={120} />
      </Box>
    );
  }

  const earned = badges.filter((b) => b.earnedAt);

  return (
    <Box data-testid="badges-widget">
      <Typography variant="body2" gutterBottom>
        {`${earned.length} / ${badges.length}`}
      </Typography>
      <Grid container spacing={1}>
        {badges.map((b) => (
          <Grid key={b.id} item xs={4} sm={3}>
            <Box
              data-testid={`badge-${b.id}`}
              sx={{
                textAlign: 'center',
                opacity: b.earnedAt ? 1 : 0.4,
              }}
            >
              <img
                src={b.iconUrl}
                alt={b.name}
                style={{ width: 40, height: 40 }}
              />
              <Typography
                variant="caption"
                noWrap
                sx={{ display: 'block' }}
              >
                {b.name}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
