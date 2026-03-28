'use client';

import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import type { Bucket } from '@/types';
import {
  BucketCard,
  CreateBucketDialog,
  ConfirmDialog,
} from '../molecules';
import labels from '@/constants/ui-labels.json';

/** @brief Props for BucketList organism. */
export interface BucketListProps {
  buckets: Bucket[];
  onCreateBucket: (name: string) => void;
  onDeleteBucket: (name: string) => void;
  onOpenBucket: (name: string) => void;
}

/**
 * @brief Grid of bucket cards with create action.
 * @param props - BucketList properties.
 */
export default function BucketList({
  buckets,
  onCreateBucket,
  onDeleteBucket,
  onOpenBucket,
}: BucketListProps) {
  const [createOpen, setCreateOpen] =
    useState(false);
  const [delTarget, setDelTarget] =
    useState<string | null>(null);

  return (
    <div data-testid="bucket-list">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h5">
          {labels.buckets.title}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
          aria-label={labels.buckets.create}
        >
          {labels.buckets.create}
        </Button>
      </Stack>

      {buckets.length === 0 ? (
        <Typography color="text.secondary">
          {labels.buckets.empty}
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {buckets.map((b) => (
            <Grid
              key={b.name}
              size={{ xs: 12, sm: 6, md: 4 }}
            >
              <BucketCard
                bucket={b}
                onOpen={onOpenBucket}
                onDelete={setDelTarget}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <CreateBucketDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={onCreateBucket}
      />

      <ConfirmDialog
        open={!!delTarget}
        title={labels.buckets.delete}
        message={labels.dialogs.deleteBucket
          .replace('{name}', delTarget ?? '')}
        onConfirm={() => {
          if (delTarget) onDeleteBucket(delTarget);
          setDelTarget(null);
        }}
        onCancel={() => setDelTarget(null)}
      />
    </div>
  );
}
