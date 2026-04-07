'use client';

import { useEffect } from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { useTranslations } from 'next-intl';

/**
 * Error boundary for the dashboard route.
 * Shows the actual error in production for debugging.
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('dashboard');
  const tc = useTranslations('common');
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <Box
      data-testid="dashboard-error"
      sx={{ p: 3 }}
    >
      <Typography variant="h5" color="error">
        {t('title')} {tc('error')}
      </Typography>
      <Typography
        variant="body2"
        component="pre"
        sx={{
          mt: 2,
          p: 2,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
          fontFamily: 'monospace',
          fontSize: 12,
        }}
      >
        {error.message}
        {'\n\n'}
        {error.stack}
      </Typography>
      <button onClick={reset}>
        {tc('retry')}
      </button>
    </Box>
  );
}
