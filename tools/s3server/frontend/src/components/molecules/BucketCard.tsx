'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FolderIcon from '@mui/icons-material/Folder';
import Stack from '@mui/material/Stack';
import type { Bucket } from '@/types';
import labels from '@/constants/ui-labels.json';

/** @brief Props for BucketCard molecule. */
export interface BucketCardProps {
  bucket: Bucket;
  onOpen: (name: string) => void;
  onDelete: (name: string) => void;
  testId?: string;
}

/**
 * @brief Card displaying a single S3 bucket.
 * @param props - BucketCard properties.
 */
export default function BucketCard({
  bucket,
  onOpen,
  onDelete,
  testId = 'bucket-card',
}: BucketCardProps) {
  return (
    <Card
      data-testid={testId}
      aria-label={`Bucket: ${bucket.name}`}
    >
      <CardContent>
        <Stack direction="row" spacing={1}
          alignItems="center">
          <FolderIcon color="primary" />
          <Typography variant="h6">
            {bucket.name}
          </Typography>
        </Stack>
        <Typography
          variant="caption"
          color="text.secondary"
        >
          {labels.buckets.created}{' '}
          {new Date(
            bucket.creationDate,
          ).toLocaleDateString()}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={() => onOpen(bucket.name)}
          aria-label={`Browse ${bucket.name}`}
        >
          {labels.buckets.open}
        </Button>
        <Button
          size="small"
          color="error"
          onClick={() => onDelete(bucket.name)}
          aria-label={`Delete ${bucket.name}`}
        >
          {labels.buckets.delete}
        </Button>
      </CardActions>
    </Card>
  );
}
