'use client';

import Box from '@shared/m3/Box';
import Skeleton from '@shared/m3/Skeleton';
import { useGamification } from '@/hooks';
import { PointsDisplay } from
  '@/components/molecules';

/**
 * Dashboard widget showing the user's total
 * points with a star icon chip.
 */
export default function PointsWidget() {
  const { points, isLoading } = useGamification();

  if (isLoading) {
    return (
      <Box data-testid="points-widget-loading">
        <Skeleton width={100} height={40} />
      </Box>
    );
  }

  return (
    <Box data-testid="points-widget">
      <PointsDisplay
        points={points}
        animate={false}
      />
    </Box>
  );
}
