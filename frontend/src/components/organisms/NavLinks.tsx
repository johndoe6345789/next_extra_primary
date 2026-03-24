'use client';

import React from 'react';
import Box from '@mui/material/Box';
import MuiLink from '@mui/material/Link';
import MuiTooltip from '@mui/material/Tooltip';
import Link from 'next/link';
import type { NavLink } from './MobileDrawer';
import { Kbd } from '../atoms/Kbd';

/** Shortcut hint attached to a nav link. */
interface NavHint {
  href: string;
  combo: string;
}

const HINTS: NavHint[] = [
  { href: '/dashboard', combo: '⌘H' },
  { href: '/chat', combo: '⌘J' },
];

const hintMap = new Map(HINTS.map((h) => [h.href, h.combo]));

/** Props for NavLinks. */
export interface NavLinksProps {
  /** Links to display. */
  links: NavLink[];
}

/**
 * Desktop horizontal nav link bar with keyboard
 * shortcut hints shown in tooltips. Hidden on xs.
 *
 * @param props - Component props.
 * @returns Nav link elements.
 */
export const NavLinks: React.FC<NavLinksProps> = ({ links }) => (
  <Box
    sx={{
      display: { xs: 'none', sm: 'flex' },
      gap: 2,
      ml: 2,
    }}
  >
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
        <MuiTooltip key={l.href} title={title} arrow>
          <MuiLink
            component={Link}
            href={l.href}
            color="inherit"
            underline="hover"
            tabIndex={0}
          >
            {l.label}
          </MuiLink>
        </MuiTooltip>
      );
    })}
  </Box>
);
