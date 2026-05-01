'use client';

import React from 'react';
import { Box, Typography, IconButton } from '@shared/m3';

/** Props for LightboxHeader. */
export interface LightboxHeaderProps {
  /** Current 1-based position. */
  current: number;
  /** Total photo count. */
  total: number;
  /** Localised "of" word. */
  ofLabel: string;
  /** Localised close label. */
  closeLabel: string;
  /** Called when close is clicked. */
  onClose: () => void;
}

/**
 * Counter and close button bar for the photo lightbox.
 *
 * @param props - LightboxHeader props.
 * @returns Header bar with counter and close button.
 */
export function LightboxHeader({
  current, total, ofLabel, closeLabel, onClose,
}: LightboxHeaderProps): React.ReactElement {
  return (
    <Box sx={{
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      px: 2, py: 1, bgcolor: 'rgba(0,0,0,0.85)',
    }}>
      <Typography variant="caption"
        sx={{ color: 'rgba(255,255,255,0.7)',
          letterSpacing: '0.08em' }}>
        {current} {ofLabel} {total}
      </Typography>
      <IconButton size="small" onClick={onClose}
        aria-label={closeLabel}
        data-testid="lightbox-close"
        sx={{ color: 'rgba(255,255,255,0.8)' }}>
        ✕
      </IconButton>
    </Box>
  );
}

export default LightboxHeader;
