'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import IconButton from '@shared/m3/IconButton';
import CloseIcon from '@shared/icons/Close';
import { t as tk } from '@shared/theme/tokens';
import {
  NextExtraLogo,
} from '@shared/components/ui/NextExtraLogo';

/** Props for DrawerHeader. */
export interface DrawerHeaderProps {
  /** Close handler. */
  onClose: () => void;
}

/**
 * Branded drawer header with app name and close
 * button. Uses a gradient background.
 *
 * @param props - Component props.
 */
export const DrawerHeader: React.FC<
  DrawerHeaderProps
> = ({ onClose }) => (
    <Box
      sx={{
        px: 2,
        py: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: tk.surfaceContainer,
      }}
      data-testid="drawer-header"
    >
      <NextExtraLogo height={28} />
      <IconButton
        onClick={onClose}
        size="small"
        aria-label="Close menu"
        sx={{ color: tk.onSurfaceVariant }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
);

export default DrawerHeader;
