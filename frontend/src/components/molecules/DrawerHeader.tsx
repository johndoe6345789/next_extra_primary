'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import IconButton from '@shared/m3/IconButton';
import CloseIcon from '@shared/icons/Close';
import { useTranslations } from 'next-intl';

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
> = ({ onClose }) => {
  const t = useTranslations('common');
  return (
    <Box
      sx={{
        px: 2,
        py: 2.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background:
          'var(--md-sys-color-primary)',
        color: 'var(--md-sys-color-on-primary)',
      }}
      data-testid="drawer-header"
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 700 }}
      >
        {t('appName')}
      </Typography>
      <IconButton
        onClick={onClose}
        size="small"
        aria-label="Close menu"
        sx={{ color: 'inherit' }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );
};

export default DrawerHeader;
