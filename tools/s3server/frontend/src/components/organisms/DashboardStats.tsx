'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import StorageIcon
  from '@mui/icons-material/Storage';
import FolderIcon
  from '@mui/icons-material/Folder';
import CloudIcon
  from '@mui/icons-material/Cloud';
import { formatBytes } from '@/utils';
import labels from '@/constants/ui-labels.json';

/** @brief Props for DashboardStats organism. */
export interface DashboardStatsProps {
  bucketCount: number;
  objectCount: number;
  totalSize: number;
}

/** @brief Single stat card. */
function StatCard({
  icon,
  label,
  value,
  testId,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  testId: string;
}) {
  return (
    <Card data-testid={testId}>
      <CardContent sx={{ textAlign: 'center' }}>
        {icon}
        <Typography variant="h4" sx={{ my: 1 }}>
          {value}
        </Typography>
        <Typography color="text.secondary">
          {label}
        </Typography>
      </CardContent>
    </Card>
  );
}

/**
 * @brief Dashboard stat cards.
 * @param props - DashboardStats properties.
 */
export default function DashboardStats({
  bucketCount,
  objectCount,
  totalSize,
}: DashboardStatsProps) {
  return (
    <Grid
      container
      spacing={3}
      data-testid="dashboard-stats"
      aria-label="Storage statistics"
    >
      <Grid size={{ xs: 12, sm: 4 }}>
        <StatCard
          icon={<FolderIcon
            color="primary"
            sx={{ fontSize: 40 }} />}
          label={labels.dashboard.buckets}
          value={String(bucketCount)}
          testId="stat-buckets"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <StatCard
          icon={<StorageIcon
            color="secondary"
            sx={{ fontSize: 40 }} />}
          label={labels.dashboard.objects}
          value={String(objectCount)}
          testId="stat-objects"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <StatCard
          icon={<CloudIcon
            color="primary"
            sx={{ fontSize: 40 }} />}
          label={labels.dashboard.storage}
          value={formatBytes(totalSize)}
          testId="stat-storage"
        />
      </Grid>
    </Grid>
  );
}
