'use client';

import React from 'react';
import { Link } from '@/i18n/navigation';

/** Props for NavbarLogo. */
export interface NavbarLogoProps {
  /** Application name text. */
  label: string;
}

/**
 * Navbar brand logo linking to home.
 *
 * @param props - Component props.
 */
export const NavbarLogo: React.FC<
  NavbarLogoProps
> = ({ label }) => (
  <Link
    href="/"
    className="brand-logo"
    data-testid="navbar-logo"
  >
    {label}
  </Link>
);

export default NavbarLogo;
