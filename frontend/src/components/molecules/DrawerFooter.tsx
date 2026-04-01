'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { ThemeToggle } from './ThemeToggle';
import { LocaleSwitcher } from './LocaleSwitcher';

/**
 * Drawer footer with theme toggle, locale switcher,
 * and a subtle version tag.
 */
export const DrawerFooter: React.FC = () => (
  <Box
    sx={{ px: 2, py: 1.5 }}
    data-testid="drawer-footer"
  >
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mb: 1,
      }}
    >
      <ThemeToggle />
      <LocaleSwitcher />
    </Box>
    <Typography
      variant="caption"
      color="text.secondary"
    >
      NextExtra v1.0
    </Typography>
  </Box>
);

export default DrawerFooter;
