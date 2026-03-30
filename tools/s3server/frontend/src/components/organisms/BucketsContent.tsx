'use client';

import Container from '@mui/material/Container';
import CircularProgress
  from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useRouter } from 'next/navigation';
import AppNavbar from './AppNavbar';
import BucketList from './BucketList';
import { useBuckets } from '@/hooks';

/**
 * @brief Authenticated bucket list content.
 * Hooks run only after AuthGuard confirms auth.
 */
export default function BucketsContent() {
  const router = useRouter();
  const {
    buckets, isLoading, error,
    createBucket, deleteBucket,
  } = useBuckets();

  const handleOpen = (name: string) => {
    router.push(`/buckets/${name}`);
  };

  return (
    <>
      <AppNavbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {isLoading ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
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
    </>
  );
}
