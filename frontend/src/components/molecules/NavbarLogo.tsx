'use client';

import React from 'react';
import Typography from '@shared/m3/Typography';
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
  <Link
    href="/"
    style={{
      textDecoration: 'none',
      color: 'inherit',
      marginRight: 'var(--spacing-2, 16px)',
    }}
    data-testid="navbar-logo"
  >
    <Typography
      variant="h6"
      noWrap
      style={{
        fontWeight: 700,
        letterSpacing: '-0.02em',
      }}
    >
      {label}
    </Typography>
  </Link>
);

export default NavbarLogo;
