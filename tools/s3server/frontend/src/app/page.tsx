'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress
  from '@mui/material/CircularProgress';
import Link from 'next/link';
import { AuthGuard } from '@/components/molecules';
import { AppNavbar, DashboardStats }
  from '@/components/organisms';
import { useDashboardStats } from '@/hooks';
import labels from '@/constants/ui-labels.json';
import routes from '@/constants/routes.json';

/** @brief Dashboard overview page. */
export default function DashboardPage() {
  const stats = useDashboardStats();

  return (
    <AuthGuard>
      <AppNavbar />
      <Container
        maxWidth="lg"
        sx={{ py: 4 }}
      >
        <Typography
          variant="h4"
          sx={{ mb: 4 }}
        >
          {labels.dashboard.title}
        </Typography>

        {stats.isLoading ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <DashboardStats
              bucketCount={stats.bucketCount}
              objectCount={stats.objectCount}
              totalSize={stats.totalSize}
            />
            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                component={Link}
                href={routes.buckets}
              >
                {labels.dashboard.viewBuckets}
              </Button>
            </Box>
          </>
        )}
      </Container>
    </AuthGuard>
  );
}
