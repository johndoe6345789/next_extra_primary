'use client';

import React from 'react';
import Typography from '@shared/m3/Typography';
import MuiLink from '@shared/m3/Link';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import s from '@shared/scss/modules/Footer.module.scss';

/** Props for the Footer organism. */
export interface FooterProps {
  /** data-testid attribute. */
  testId?: string;
}

/**
 * Footer with copyright and nav links.
 *
 * @param props - Component props.
 */
export const Footer: React.FC<FooterProps> = ({ testId = 'footer' }) => {
  const tCommon = useTranslations('common');
  const tNav = useTranslations('nav');
  const links = [
    { labelKey: 'about' as const, href: '/about' },
    { labelKey: 'contact' as const, href: '/contact' },
  ];
  return (
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
          &copy; {new Date().getFullYear()}{' '}
          {tCommon('appName')}
        </Typography>
        <nav aria-label="Footer navigation">
          {links.map((l) => (
            <MuiLink
              key={l.href}
              component={Link}
              href={l.href}
              tabIndex={0}
              data-testid={`footer-${l.labelKey}`}
            >
              {tNav(l.labelKey)}
            </MuiLink>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
