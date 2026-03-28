'use client';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import type { Bucket } from '@/types';
import BucketCard from './BucketCard';
import labels from '@/constants/ui-labels.json';

/** @brief Props for BucketGrid molecule. */
export interface BucketGridProps {
  buckets: Bucket[];
  onOpen: (name: string) => void;
  onDelete: (name: string) => void;
}

/**
 * @brief Grid of bucket cards or empty state.
 * @param props - BucketGrid properties.
 */
export default function BucketGrid({
  buckets,
  onOpen,
  onDelete,
}: BucketGridProps) {
  if (buckets.length === 0) {
    return (
      <Typography color="text.secondary">
        {labels.buckets.empty}
      </Typography>
    );
  }

  return (
    <Grid
      container
      spacing={2}
      data-testid="bucket-grid"
    >
      {buckets.map((b) => (
        <Grid
          key={b.name}
          size={{ xs: 12, sm: 6, md: 4 }}
        >
          <BucketCard
            bucket={b}
            onOpen={onOpen}
            onDelete={onDelete}
          />
        </Grid>
      ))}
    </Grid>
  );
}
