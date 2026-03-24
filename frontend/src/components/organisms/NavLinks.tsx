'use client';

import React from 'react';
import Box from '@mui/material/Box';
import MuiLink from '@mui/material/Link';
import Link from 'next/link';
import type { NavLink } from './MobileDrawer';

/** Props for NavLinks. */
export interface NavLinksProps {
  /** Links to display. */
  links: NavLink[];
}

/**
 * Desktop horizontal nav link bar.
 * Hidden on xs screens.
 */
export const NavLinks: React.FC<NavLinksProps> = ({ links }) => (
  <Box
    sx={{
      display: { xs: 'none', sm: 'flex' },
      gap: 2,
      ml: 2,
    }}
  >
    {links.map((l) => (
      <MuiLink
        key={l.href}
        component={Link}
        href={l.href}
        color="inherit"
        underline="hover"
        tabIndex={0}
      >
        {l.label}
      </MuiLink>
    ))}
  </Box>
);
