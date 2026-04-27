'use client';

import { useEffect } from 'react';
import { Box, Typography, Button } from '@shared/m3';

/**
 * Locale-level error boundary. Catches uncaught render
 * errors from any page or layout under [locale] so the
 * navbar/shell stay mounted and the user can recover.
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[locale] error boundary:', error);
  }, [error]);

  const isDev = process.env.NODE_ENV !== 'production';

  return (
    <Box
      role="alert"
      data-testid="locale-error"
      sx={{ p: 4, maxWidth: 720, mx: 'auto' }}
    >
      <Typography variant="h5" color="error" gutterBottom>
        Something went wrong
      </Typography>
      <Typography variant="body2" color="text.secondary">
        We hit an unexpected error rendering this page.
        {error.digest && ` (ref: ${error.digest})`}
      </Typography>
      {isDev && (
        <Typography
          component="pre"
          variant="caption"
          sx={{
            mt: 2,
            p: 2,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            fontFamily: 'monospace',
            backgroundColor: 'action.hover',
            borderRadius: 1,
          }}
        >
          {error.message}
        </Typography>
      )}
      <Button
        variant="contained"
        onClick={reset}
        sx={{ mt: 3 }}
      >
        Try again
      </Button>
    </Box>
  );
}
