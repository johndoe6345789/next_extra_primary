'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import MuiLink from '@mui/material/Link';
import CircularProgress
  from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Link from 'next/link';
import { AuthGuard } from '@/components/molecules';
import { AppNavbar, ObjectTable }
  from '@/components/organisms';
import { useObjects } from '@/hooks';
import labels from '@/constants/ui-labels.json';
import routes from '@/constants/routes.json';

/** @brief Object browser for a single bucket. */
export default function BucketDetailPage() {
  const params = useParams<{ name: string }>();
  const bucket = params.name;
  const [prefix, setPrefix] = useState('');

  const {
    objects,
    isLoading,
    error,
    refresh,
    uploadObject,
    downloadObject,
    deleteObject,
  } = useObjects(bucket, prefix);

  return (
    <AuthGuard>
      <AppNavbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <MuiLink
            component={Link}
            href={routes.buckets}
            underline="hover"
          >
            {labels.buckets.title}
          </MuiLink>
          <Typography color="text.primary">
            {bucket}
          </Typography>
        </Breadcrumbs>

        <Typography variant="h5" sx={{ mb: 3 }}>
          {bucket}
        </Typography>

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
          <ObjectTable
            objects={objects}
            bucketName={bucket}
            prefix={prefix}
            onPrefixChange={setPrefix}
            onUpload={uploadObject}
            onDownload={downloadObject}
            onDelete={deleteObject}
            onRefresh={refresh}
          />
        )}
      </Container>
    </AuthGuard>
  );
}
