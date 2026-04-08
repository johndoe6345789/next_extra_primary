'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  Footer as SharedFooter,
} from '@shared/components/ui/Footer';
import footerLinks from
  '@/constants/footer-links.json';

/**
 * Frontend Footer wrapper that injects i18n
 * translations and Next.js routing into the
 * shared Footer component.
 */
export const Footer: React.FC = () => {
  const tCommon = useTranslations('common');
  const tNav = useTranslations('nav');

  const links = footerLinks.map((l) => ({
    href: l.href,
    label: tNav(l.labelKey),
    testId: `footer-${l.labelKey}`,
  }));

  return (
    <SharedFooter
      appName={tCommon('appName')}
      links={links}
    />
  );
};

export default Footer;
