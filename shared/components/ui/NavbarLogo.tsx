'use client';

import React from 'react';
import { useLink } from './LinkContext';
import { NextExtraLogo } from './NextExtraLogo';
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
 * Renders an SVG wordmark inside a
 * framework-agnostic Link.
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
      <NextExtraLogo
        height={36}
        ariaLabel={label}
      />
    </Link>
  );
};

export default NavbarLogo;
