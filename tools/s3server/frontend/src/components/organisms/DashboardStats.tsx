'use client';

import {
  Card, CardContent, Typography,
  Grid, Storage, Folder, Cloud,
} from '@metabuilder/m3';
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
  icon, label, value, testId,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  testId: string;
}) {
  return (
    <Card data-testid={testId}>
      <CardContent
        style={{ textAlign: 'center' }}
      >
        {icon}
        <Typography
          variant="h4"
          style={{ margin: '8px 0' }}
        >
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
  bucketCount, objectCount, totalSize,
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
          icon={<Folder
            color="primary"
            style={{ fontSize: 40 }} />}
          label={labels.dashboard.buckets}
          value={String(bucketCount)}
          testId="stat-buckets"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <StatCard
          icon={<Storage
            color="secondary"
            style={{ fontSize: 40 }} />}
          label={labels.dashboard.objects}
          value={String(objectCount)}
          testId="stat-objects"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <StatCard
          icon={<Cloud
            color="primary"
            style={{ fontSize: 40 }} />}
          label={labels.dashboard.storage}
          value={formatBytes(totalSize)}
          testId="stat-storage"
        />
      </Grid>
    </Grid>
  );
}
