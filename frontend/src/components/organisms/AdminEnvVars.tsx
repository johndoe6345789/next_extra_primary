'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import { useTranslations } from 'next-intl';
import { VersionInfo } from
  '../molecules/VersionInfo';
import { useGetEnvVarsQuery } from
  '@/store/api/adminApi';
import type { EnvVar } from
  '@/store/api/adminTypes';
import { AdminEnvVarGroup } from
  './AdminEnvVarGroup';

/** Frontend env vars to display. */
const FE_VARS = [
  { name: 'NEXT_PUBLIC_BASE_PATH',
    group: 'frontend' },
  { name: 'NEXT_PUBLIC_API_URL',
    group: 'frontend' },
  { name: 'NODE_ENV',
    group: 'frontend' },
] as const;

/**
 * Admin panel showing backend and frontend
 * environment variables.
 */
export const AdminEnvVars: React.FC = () => {
  const t = useTranslations('admin');
  const { data } = useGetEnvVarsQuery();
  const beVars = data?.vars ?? [];

  const feVars: EnvVar[] = FE_VARS.map((v) => ({
    ...v,
    value: (typeof process !== 'undefined'
      && process.env?.[v.name]) || '',
    set: !!(typeof process !== 'undefined'
      && process.env?.[v.name]),
  }));

  const allVars = [...beVars, ...feVars];
  const groups = [
    ...new Set(allVars.map((v) => v.group)),
  ];

  return (
    <Box data-testid="admin-env-vars">
      <VersionInfo />
      {groups.map((group) => (
        <AdminEnvVarGroup
          key={group}
          group={group}
          vars={allVars.filter(
            (v) => v.group === group,
          )}
          setLabel={t('set')}
          notSetLabel={t('notSet')}
        />
      ))}
    </Box>
  );
};

export default AdminEnvVars;
