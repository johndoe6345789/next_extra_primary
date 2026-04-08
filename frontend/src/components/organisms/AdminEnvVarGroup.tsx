'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { Chip } from '../atoms';
import type { EnvVar } from '@/store/api/adminTypes';

/** Props for the env var group component. */
export interface AdminEnvVarGroupProps {
  /** Group label (e.g. "backend"). */
  group: string;
  /** Variables belonging to this group. */
  vars: EnvVar[];
  /** Label for set variables. */
  setLabel: string;
  /** Label for unset variables. */
  notSetLabel: string;
}

/**
 * Renders a single group of environment
 * variables in a styled card.
 */
export const AdminEnvVarGroup: React.FC<
  AdminEnvVarGroupProps
> = ({ group, vars, setLabel, notSetLabel }) => (
  <Box style={{
    marginBottom: 16, padding: 16,
    borderRadius:
      'var(--mat-sys-corner-large, 16px)',
    background:
      'var(--mat-sys-surface-container'
      + ', #f5f5f5)',
  }}>
    <Typography variant="subtitle2" style={{
      fontWeight: 600,
      textTransform: 'capitalize',
      marginBottom: 8,
    }}>
      {group}
    </Typography>
    {vars.map((v) => (
      <div key={v.name} style={{
        display: 'flex', gap: 8,
        alignItems: 'center',
        padding: '4px 0',
        fontFamily: 'monospace',
        fontSize: 13,
      }}>
        <span style={{ minWidth: 220 }}>
          {v.name}
        </span>
        <Chip
          label={v.set
            ? v.value || setLabel
            : notSetLabel}
          testId={`env-${v.name}`}
        />
      </div>
    ))}
  </Box>
);

export default AdminEnvVarGroup;
