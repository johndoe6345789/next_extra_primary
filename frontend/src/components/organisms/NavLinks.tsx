'use client';

import React from 'react';
import { Tooltip } from '@shared/m3';
import { Link } from '@/i18n/navigation';
import type { NavLink } from './MobileDrawer';
import { Kbd } from '../atoms/Kbd';
import s from '@shared/scss/modules/NavLinks.module.scss';

/** Shortcut hint attached to a nav link. */
interface NavHint {
  href: string;
  combo: string;
}

const HINTS: NavHint[] = [
  { href: '/dashboard', combo: '⌘H' },
  { href: '/chat', combo: '⌘J' },
];

const hintMap = new Map(
  HINTS.map((h) => [h.href, h.combo]),
);

/** Props for NavLinks. */
export interface NavLinksProps {
  /** Links to display. */
  links: NavLink[];
}

/**
 * Desktop nav links with keyboard hints.
 *
 * @param props - Component props.
 * @returns Nav link elements.
 */
export const NavLinks: React.FC<
  NavLinksProps
> = ({ links }) => (
  <nav className={s.root} aria-label="Main">
    {links.map((l) => {
      const combo = hintMap.get(l.href);
      const title = combo ? (
        <span>
          {l.label} <Kbd combo={combo} />
        </span>
      ) : (
        l.label
      );
      return (
        <Tooltip
          key={l.href}
          title={title}
          arrow
        >
          <Link href={l.href}>{l.label}</Link>
        </Tooltip>
      );
    })}
  </nav>
);

export default NavLinks;
