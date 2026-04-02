'use client';

import React from 'react';
import {
  Typography,
  Link as MuiLink,
} from '../m3';
import s from '../../scss/modules/Footer.module.scss';

/** A single footer navigation link. */
export interface FooterLink {
  /** Link destination. */
  href: string;
  /** Visible label text. */
  label: string;
  /** data-testid suffix. */
  testId?: string;
}

/** Props for the Footer organism. */
export interface FooterProps {
  /** Copyright holder name (e.g. app name). */
  appName: string;
  /** Navigation links rendered in the footer. */
  links: FooterLink[];
  /** data-testid attribute. */
  testId?: string;
}

/**
 * Footer with copyright and nav links.
 * Accepts links as props so the consumer can
 * wrap hrefs with framework-specific routing.
 *
 * @param props - Component props.
 */
export const Footer: React.FC<FooterProps> = ({
  appName,
  links,
  testId = 'footer',
}) => (
  <footer
    className={s.root}
    role="contentinfo"
    data-testid={testId}
  >
    <div className={s.inner}>
      <Typography
        variant="body2"
        color="text.secondary"
        data-testid="footer-copyright"
      >
        &copy; {new Date().getFullYear()} {appName}
      </Typography>
      <nav aria-label="Footer navigation">
        {links.map((l) => (
          <MuiLink
            key={l.href}
            component="a"
            href={l.href}
            tabIndex={0}
            data-testid={l.testId}
          >
            {l.label}
          </MuiLink>
        ))}
      </nav>
    </div>
  </footer>
);

export default Footer;
