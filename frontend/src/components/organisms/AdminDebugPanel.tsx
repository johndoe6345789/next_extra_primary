'use client';

import React from 'react';
import { Box, Typography } from '@shared/m3';
import { Button } from '../atoms';
import { DebugApiRow } from '../molecules/DebugApiRow';
import { useDebugPanel } from '@/hooks/useDebugPanel';
import { useTranslations } from 'next-intl';

/**
 * Admin debug panel showing API telemetry,
 * auth state, and environment info.
 */
export const AdminDebugPanel: React.FC = () => {
  const t = useTranslations('admin');
  const { entries, auth, env, clear } =
    useDebugPanel();

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column',
        gap: 3, p: 2 }}
      data-testid="debug-panel"
    >
      <Typography variant="h5">
        {t('debugPanel')}
      </Typography>

      <Box>
        <Typography variant="subtitle2">
          {t('authState')}
        </Typography>
        <Box sx={{ fontFamily: 'monospace', fontSize: 13 }}>
          <div>Authenticated: {String(auth.isAuthenticated)}</div>
          <div>Role: {auth.role}</div>
          <div>User ID: {auth.userId || 'N/A'}</div>
        </Box>
      </Box>

      <Box>
        <Typography variant="subtitle2">
          {t('environment')}
        </Typography>
        <Box sx={{ fontFamily: 'monospace', fontSize: 13 }}>
          <div>API URL: {env.apiUrl || '(default)'}</div>
          <div>Base Path: {env.basePath || '/'}</div>
          <div>Node Env: {env.nodeEnv}</div>
        </Box>
      </Box>

      <Box>
        <Box sx={{ display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2">
            {t('apiCalls')} ({entries.length})
          </Typography>
          <Button
            onClick={clear}
            testId="debug-clear"
            ariaLabel={t('clear')}
          >
            {t('clear')}
          </Button>
        </Box>
        {entries.length === 0 ? (
          <Typography color="text.secondary">
            {t('noApiCalls')}
          </Typography>
        ) : (
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {entries.map((e, i) => (
              <DebugApiRow
                key={`${e.requestId}-${i}`}
                entry={e}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AdminDebugPanel;
