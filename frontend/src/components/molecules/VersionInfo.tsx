'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { t } from '@shared/theme/tokens';
import { useGetVersionQuery } from
  '@/store/api/adminApi';
import pkg from '../../../package.json';

/** Props for VersionInfo molecule. */
export interface VersionInfoProps {
  /** data-testid attribute. */
  testId?: string;
}

/**
 * Displays frontend and backend version
 * numbers in a compact card.
 */
export const VersionInfo: React.FC<
  VersionInfoProps
> = ({ testId = 'version-info' }) => {
  const { data } = useGetVersionQuery();

  return (
    <Box
      data-testid={testId}
      style={{
        marginBottom: 16, padding: 16,
        borderRadius: t.large,
        background: t.surfaceContainer,
      }}
    >
      <Typography variant="subtitle2"
        style={{
          fontWeight: 600, marginBottom: 8,
        }}>
        Versions
      </Typography>
      <div style={{
        fontFamily: 'monospace',
        fontSize: 13, padding: '4px 0',
      }}>
        Frontend: {pkg.version}
      </div>
      <div style={{
        fontFamily: 'monospace',
        fontSize: 13, padding: '4px 0',
      }}>
        Backend: {data?.backend ?? '...'}
      </div>
    </Box>
  );
};

export default VersionInfo;
