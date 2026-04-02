'use client';

import React from 'react';
import { Link } from '@/i18n/navigation';
import s from '@shared/scss/modules/NavbarLogo.module.scss';

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
    className={s.root}
    data-testid="navbar-logo"
  >
    {label}
  </Link>
);

export default NavbarLogo;
