'use client';

import React from 'react';
import { useLink } from './LinkContext';
import s from '../../scss/modules/NavbarLogo.module.scss';

/** Props for NavbarLogo. */
export interface NavbarLogoProps {
  /** Application name text. */
  label: string;
  /** Optional href override. */
  href?: string;
}

/**
 * Navbar brand logo linking to home.
 * Uses a plain anchor so the consumer can wrap
 * with a framework-specific Link if needed.
 *
 * @param props - Component props.
 */
export const NavbarLogo: React.FC<
  NavbarLogoProps
> = ({ label, href = '/' }) => {
  const Link = useLink();
  return (
    <Link
      href={href}
      className={s.root}
      data-testid="navbar-logo"
    >
      {label}
    </Link>
  );
};

export default NavbarLogo;
