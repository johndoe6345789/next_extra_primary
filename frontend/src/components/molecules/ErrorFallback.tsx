'use client';

import React, { useState } from 'react';
import { Box, Typography } from '@shared/m3';
import { t } from '@shared/theme/tokens';
import Button from '@shared/m3/Button';
import { buildDebugInfo } from './buildDebugInfo';

/** Props for ErrorFallback. */
export interface ErrorFallbackProps {
  /** Debug reference code. */
  debugCode: string;
  /** Error message. */
  message: string;
  /** Reset handler. */
  onReset: () => void;
}

/**
 * Error fallback UI showing a debug code and
 * a button to copy diagnostic info.
 */
export const ErrorFallback: React.FC<
  ErrorFallbackProps
> = ({ debugCode, message, onReset }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const info = buildDebugInfo(
      debugCode, message,
    );
    await navigator.clipboard.writeText(info);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box
      sx={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh', gap: 2, p: 4,
        textAlign: 'center',
      }}
      data-testid="error-fallback"
    >
      <Typography variant="h5">
        Something went wrong
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontFamily: 'monospace', fontSize: 18,
          p: 1, borderRadius: 1,
          bgcolor: t.surfaceContainer,
        }}
        data-testid="debug-code"
      >
        {debugCode}
      </Typography>
      <Typography color="text.secondary">
        Share this code with support
      </Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          onClick={handleCopy}
          data-testid="copy-debug"
          aria-label="Copy debug info"
        >
          {copied ? 'Copied!' : 'Copy Debug Info'}
        </Button>
        <Button
          onClick={onReset}
          data-testid="error-reset"
          aria-label="Try again"
        >
          Try Again
        </Button>
      </Box>
    </Box>
  );
};

export default ErrorFallback;
