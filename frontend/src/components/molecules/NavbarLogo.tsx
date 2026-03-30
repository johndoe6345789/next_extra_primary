'use client';

import React from 'react';
import Typography from '@metabuilder/m3/Typography';
import MuiLink from '@metabuilder/m3/Link';
import { Link } from '@/i18n/navigation';

/** Props for NavbarLogo. */
export interface NavbarLogoProps {
  /** Application name text. */
  label: string;
}

/**
 * Navbar brand logo linking to the home page.
 *
 * @param props - Component props.
 */
export const NavbarLogo: React.FC<NavbarLogoProps> = ({
  label,
}) => (
  <MuiLink
    component={Link}
    href="/"
    underline="none"
    color="inherit"
    data-testid="navbar-logo"
    sx={{ mr: { xs: 0.5, md: 2 } }}
  >
    <Typography
      variant="h6"
      noWrap
      sx={{
        fontWeight: 700,
        letterSpacing: '-0.02em',
      }}
    >
      {label}
    </Typography>
  </MuiLink>
);

export default NavbarLogo;
