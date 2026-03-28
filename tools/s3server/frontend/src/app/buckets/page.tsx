'use client';

import Container from '@mui/material/Container';
import CircularProgress
  from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/molecules';
import { AppNavbar, BucketList }
  from '@/components/organisms';
import { useBuckets } from '@/hooks';

/** @brief Bucket list page. */
export default function BucketsPage() {
  const router = useRouter();
  const {
    buckets,
    isLoading,
    error,
    createBucket,
    deleteBucket,
  } = useBuckets();

  const handleOpen = (name: string) => {
    router.push(`/buckets/${name}`);
  };

  return (
    <AuthGuard>
      <AppNavbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {isLoading ? (
          <Box
            sx={{ textAlign: 'center', py: 6 }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <BucketList
            buckets={buckets}
            onCreateBucket={createBucket}
            onDeleteBucket={deleteBucket}
            onOpenBucket={handleOpen}
          />
        )}
      </Container>
    </AuthGuard>
  );
}
